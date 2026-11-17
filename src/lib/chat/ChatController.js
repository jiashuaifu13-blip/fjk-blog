import {
  PetStates,
} from '../pet/PetStates.js'


export class ChatController {

  constructor({
    client,
    stateMachine,
  }) {

    this.client =
      client

    this.stateMachine =
      stateMachine


    this.messages =
      []


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

        message,

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