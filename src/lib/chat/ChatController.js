import {
  PetStates,
} from '../pet/PetStates.js'


export class ChatController {

  constructor({
    client,
    stateMachine,
    maxContextRounds = 6,
  }) {

    this.client =
      client

    this.stateMachine =
      stateMachine


    /*
     * 聊天记录只保存在当前浏览器内存。
     *
     * 不写：
     * localStorage
     * sessionStorage
     * IndexedDB
     * 服务端数据库
     *
     * 页面刷新后自然清空。
     */
    this.messages =
      []


    /*
     * 最多向 AI 携带最近几轮
     * 完整 user / assistant 对话。
     */
    this.maxContextRounds =
      Math.max(
        1,
        Number(
          maxContextRounds
        ) ||
        6
      )


    this.generating =
      false


    this.abortController =
      null


    this.onMessagesChange =
      null

    this.onGeneratingChange =
      null

    this.onBubbleChange =
      null

    this.onError =
      null
  }


  createId() {

    return (
      `${Date.now()}-` +
      `${Math.random()
        .toString(36)
        .slice(2)}`
    )
  }


  emitMessages() {

    if (
      typeof this.onMessagesChange ===
      'function'
    ) {

      this.onMessagesChange(
        [...this.messages]
      )
    }
  }


  setGenerating(
    value
  ) {

    this.generating =
      value


    if (
      typeof this.onGeneratingChange ===
      'function'
    ) {

      this.onGeneratingChange(
        value
      )
    }
  }


  setBubble(
    content
  ) {

    if (
      typeof this.onBubbleChange ===
      'function'
    ) {

      this.onBubbleChange(
        content
      )
    }
  }


  /*
   * ========================================================
   * AI Context
   * ========================================================
   *
   * 只把“完整成功”的历史轮次发送给 AI。
   *
   * 允许进入上下文：
   *
   * user(done)
   * assistant(done)
   *
   * 不允许进入上下文：
   *
   * assistant(streaming)
   * assistant(aborted)
   * assistant(error)
   *
   * 这样可以避免把：
   *
   * 正在思考…
   * （回复已停止）
   * API 错误提示
   * 半截 Streaming 回答
   *
   * 当成 AI 的正常历史重新喂给模型。
   */
  buildContextMessages(
    currentUserId
  ) {

    const rounds =
      []


    /*
     * 当前用户消息之前的记录，
     * 才属于“历史”。
     */
    const currentIndex =
      this.messages.findIndex(
        (message) =>
          message.id ===
          currentUserId
      )


    const historyEnd =
      currentIndex >= 0
        ? currentIndex
        : this.messages.length


    let pendingUser =
      null


    for (
      let index = 0;
      index < historyEnd;
      index += 1
    ) {

      const item =
        this.messages[index]


      if (
        !item ||
        typeof item !==
          'object'
      ) {
        continue
      }


      const role =
        item.role


      const status =
        item.status


      const content =
        String(
          item.content ??
          ''
        ).trim()


      /*
       * 新的 user 消息开始一轮。
       */
      if (
        role ===
          'user' &&
        status ===
          'done' &&
        content
      ) {

        pendingUser = {
          role:
            'user',

          content,
        }


        continue
      }


      /*
       * 只有紧跟一个成功 assistant，
       * 这一轮才算完整历史。
       */
      if (
        role ===
          'assistant'
      ) {

        if (
          pendingUser &&
          status ===
            'done' &&
          content
        ) {

          rounds.push([
            pendingUser,

            {
              role:
                'assistant',

              content,
            },
          ])
        }


        /*
         * 无论 assistant 是成功、
         * aborted 还是 error，
         * 这一轮到这里都结束。
         */
        pendingUser =
          null
      }
    }


    /*
     * 只保留最近 N 轮完整对话。
     */
    const recentRounds =
      rounds.slice(
        -this.maxContextRounds
      )


    const context =
      recentRounds.flat()


    /*
     * 当前这一条用户消息必须放在最后。
     */
    const currentUser =
      this.messages.find(
        (message) =>
          message.id ===
          currentUserId
      )


    const currentContent =
      String(
        currentUser?.content ??
        ''
      ).trim()


    if (
      currentContent
    ) {

      context.push({
        role:
          'user',

        content:
          currentContent,
      })
    }


    return context
  }


  async send(
    content
  ) {

    const message =
      String(
        content ??
        ''
      ).trim()


    if (
      !message ||
      this.generating
    ) {
      return false
    }


    const userMessage = {
      id:
        this.createId(),

      role:
        'user',

      content:
        message,

      status:
        'done',
    }


    const assistantMessage = {
      id:
        this.createId(),

      role:
        'assistant',

      content:
        '',

      status:
        'streaming',
    }


    this.messages.push(
      userMessage,
      assistantMessage
    )


    this.emitMessages()


    /*
     * 在开始请求前生成上下文快照。
     *
     * 此时当前 assistant 还是 streaming，
     * buildContextMessages() 会自动忽略它。
     */
    const contextMessages =
      this.buildContextMessages(
        userMessage.id
      )


    this.abortController =
      new AbortController()


    this.setGenerating(
      true
    )


    this.setBubble(
      '正在思考…'
    )


    try {

      await this.stateMachine
        .setState(
          PetStates.THINKING,
          {
            force:
              true,

            reason:
              'chat-request',
          }
        )


      await this.client.send({

        /*
         * message 暂时继续保留，
         * 用于兼容当前旧版 Go 后端。
         */
        message,


        /*
         * 新版后端使用 messages
         * 实现真正多轮上下文。
         */
        messages:
          contextMessages,


        signal:
          this.abortController.signal,


        onStart:
          async () => {

            try {

              await this.stateMachine
                .setState(
                  PetStates.SPEAKING,
                  {
                    force:
                      true,

                    reason:
                      'chat-stream-start',
                  }
                )

            } catch (error) {

              console.error(
                '[ChatController] Failed to enter SPEAKING:',
                error
              )
            }
          },


        onToken:
          (token) => {

            assistantMessage.content +=
              token


            this.setBubble(
              assistantMessage.content
            )


            this.emitMessages()
          },
      })


      assistantMessage.status =
        'done'


      this.emitMessages()


      await this.stateMachine
        .setState(
          PetStates.IDLE,
          {
            force:
              true,

            reason:
              'chat-complete',
          }
        )


      return true

    } catch (error) {

      if (
        error?.name ===
        'AbortError'
      ) {

        assistantMessage.status =
          'aborted'


        if (
          assistantMessage.content
        ) {

          assistantMessage.content +=
            '\n（回复已停止）'

        } else {

          assistantMessage.content =
            '（回复已停止）'
        }


        this.setBubble(
          assistantMessage.content
        )


        this.emitMessages()


        await this.safeSetState(
          PetStates.IDLE,
          'chat-aborted'
        )


        return false
      }


      console.error(
        '[ChatController]',
        error
      )


      assistantMessage.status =
        'error'


      assistantMessage.content =
        String(
          error?.userMessage ||
          '聊天暂时不可用，请检查 AI 配置后重试。'
        )


      this.setBubble(
        assistantMessage.content
      )


      this.emitMessages()


      await this.safeSetState(
        PetStates.ERROR,
        'chat-error'
      )


      if (
        typeof this.onError ===
        'function'
      ) {

        this.onError(
          error
        )
      }


      /*
       * ERROR 动作短暂展示后回到 IDLE，
       * 防止一次 API 错误把桌宠永久卡住。
       */
      await this.sleep(
        700
      )


      await this.safeSetState(
        PetStates.IDLE,
        'chat-error-recovered'
      )


      return false

    } finally {

      this.abortController =
        null


      this.setGenerating(
        false
      )
    }
  }


  stop() {

    if (
      !this.abortController
    ) {
      return
    }


    this.abortController.abort()
  }


  clear() {

    this.stop()


    /*
     * 清空 UI 聊天记录的同时，
     * 也等于清空 AI 上下文。
     */
    this.messages =
      []


    this.setBubble(
      ''
    )


    this.emitMessages()
  }


  async safeSetState(
    state,
    reason
  ) {

    try {

      await this.stateMachine
        .setState(
          state,
          {
            force:
              true,

            reason,
          }
        )

    } catch (error) {

      console.error(
        '[ChatController] state transition failed:',
        error
      )
    }
  }


  sleep(
    duration
  ) {

    return new Promise(
      (resolve) => {

        window.setTimeout(
          resolve,
          duration
        )
      }
    )
  }
}