export class HttpChatClient {

  constructor({
    endpoint = '/api/chat',
    getConfig = null,
  } = {}) {

    this.endpoint =
      endpoint


    this.getConfig =
      getConfig
  }


  async send({
    message,
    messages = [],
    signal,
    onStart,
    onToken,
  }) {

    const content =
      String(
        message ??
        ''
      ).trim()


    if (!content) {

      throw new Error(
        'Message cannot be empty'
      )
    }


    if (
      content.length >
      1200
    ) {

      throw new Error(
        'Message is too long'
      )
    }


    const config =
      this.readConfig()


    if (
      !config
    ) {

      const error =
        new Error(
          'AI configuration is required'
        )


      error.userMessage =
        '请先配置自己的 AI API。'


      throw error
    }


    /*
     * ========================================================
     * Context Messages
     * ========================================================
     *
     * ChatController 已经负责：
     *
     * - 保留最近若干完整轮次
     * - 排除 aborted
     * - 排除 error
     * - 排除 streaming
     *
     * HttpChatClient 再做一层格式清洗，
     * 防止非法对象进入网络请求。
     */
    const contextMessages =
      this.normalizeMessages(
        messages,
        content
      )


    const response =
      await fetch(
        this.endpoint,
        {
          method:
            'POST',

          headers: {
            'Content-Type':
              'application/json',

            'Accept':
              'application/x-ndjson',

            /*
             * API Key 不放 JSON，
             * 通过单独请求头临时传给服务器。
             */
            'X-AI-Key':
              config.apiKey,
          },

          body:
            JSON.stringify({

              /*
               * 保留旧字段，
               * 兼容当前线上 Go 后端。
               *
               * 等新版后端完成并验收后，
               * 再决定是否彻底删除。
               */
              message:
                content,


              /*
               * 新字段：
               * 用于真正的多轮上下文。
               */
              messages:
                contextMessages,


              provider:
                config.provider,

              model:
                config.model,
            }),

          signal,

          cache:
            'no-store',

          credentials:
            'same-origin',
        }
      )


    this.throwIfAborted(
      signal
    )


    if (
      !response.ok
    ) {

      const detail =
        await this.readErrorResponse(
          response
        )


      const error =
        new Error(
          detail ||
          `Chat request failed: ${response.status}`
        )


      error.userMessage =
        this.getUserErrorMessage(
          response.status
        )


      throw error
    }


    if (
      !response.body
    ) {

      const error =
        new Error(
          'Streaming response body is unavailable'
        )


      error.userMessage =
        '浏览器无法读取 AI 流式响应。'


      throw error
    }


    const reader =
      response.body
        .getReader()


    const decoder =
      new TextDecoder(
        'utf-8'
      )


    let buffer =
      ''


    let started =
      false


    let doneReceived =
      false


    let fullReply =
      ''


    try {

      while (true) {

        this.throwIfAborted(
          signal
        )


        const {
          value,
          done,
        } =
          await reader.read()


        if (done) {
          break
        }


        buffer +=
          decoder.decode(
            value,
            {
              stream:
                true,
            }
          )


        const lines =
          buffer.split(
            /\r?\n/
          )


        /*
         * 最后一部分可能只是半条 NDJSON，
         * 留给下一次网络 chunk。
         */
        buffer =
          lines.pop() ??
          ''


        for (
          const line of lines
        ) {

          if (
            !line.trim()
          ) {
            continue
          }


          const result =
            await this.handleLine({
              line,
              onStart,
              onToken,
              started,
              fullReply,
            })


          started =
            result.started


          fullReply =
            result.fullReply


          if (
            result.done
          ) {

            doneReceived =
              true
          }
        }
      }


      buffer +=
        decoder.decode()


      if (
        buffer.trim()
      ) {

        const result =
          await this.handleLine({
            line:
              buffer,

            onStart,
            onToken,

            started,
            fullReply,
          })


        started =
          result.started


        fullReply =
          result.fullReply


        if (
          result.done
        ) {

          doneReceived =
            true
        }
      }


      this.throwIfAborted(
        signal
      )


      if (
        !doneReceived
      ) {

        const error =
          new Error(
            'Chat stream ended before done event'
          )


        error.userMessage =
          'AI 连接意外中断，请重新发送。'


        throw error
      }


      return fullReply

    } finally {

      try {

        reader.releaseLock()

      } catch {

        // ignore
      }
    }
  }


  /*
   * ========================================================
   * Normalize Context
   * ========================================================
   *
   * 网络层只接受：
   *
   * {
   *   role: 'user' | 'assistant',
   *   content: '...'
   * }
   *
   * 不把 UI 内部字段发送出去：
   *
   * id
   * status
   * generating
   * ...
   */
  normalizeMessages(
    messages,
    fallbackMessage
  ) {

    const result =
      []


    if (
      Array.isArray(
        messages
      )
    ) {

      for (
        const item of messages
      ) {

        if (
          !item ||
          typeof item !==
            'object'
        ) {
          continue
        }


        const role =
          String(
            item.role ??
            ''
          ).trim()


        if (
          role !==
            'user' &&
          role !==
            'assistant'
        ) {
          continue
        }


        const content =
          String(
            item.content ??
            ''
          ).trim()


        if (
          !content
        ) {
          continue
        }


        result.push({
          role,
          content,
        })
      }
    }


    /*
     * 理论上 ChatController 一定会提供 messages。
     *
     * 这里保留 fallback，
     * 防止未来其他地方直接调用 HttpChatClient。
     */
    if (
      result.length ===
      0
    ) {

      const content =
        String(
          fallbackMessage ??
          ''
        ).trim()


      if (
        content
      ) {

        result.push({
          role:
            'user',

          content,
        })
      }
    }


    return result
  }


  readConfig() {

    if (
      typeof this.getConfig !==
        'function'
    ) {
      return null
    }


    const value =
      this.getConfig()


    if (
      !value ||
      typeof value !==
        'object'
    ) {
      return null
    }


    const provider =
      String(
        value.provider ??
        ''
      ).trim()


    const model =
      String(
        value.model ??
        ''
      ).trim()


    const apiKey =
      String(
        value.apiKey ??
        ''
      ).trim()


    if (
      !provider ||
      !model ||
      !apiKey
    ) {
      return null
    }


    return {
      provider,
      model,
      apiKey,
    }
  }


  async handleLine({
    line,
    onStart,
    onToken,
    started,
    fullReply,
  }) {

    let event


    try {

      event =
        JSON.parse(
          line
        )

    } catch {

      const error =
        new Error(
          'Invalid NDJSON response from chat server'
        )


      error.userMessage =
        '服务器返回了无法解析的数据。'


      throw error
    }


    if (
      !event ||
      typeof event !==
        'object'
    ) {

      return {
        started,
        fullReply,
        done:
          false,
      }
    }


    switch (
      event.type
    ) {

      case 'start': {

        if (
          !started
        ) {

          started =
            true


          if (
            typeof onStart ===
              'function'
          ) {

            await onStart()
          }
        }


        return {
          started,
          fullReply,
          done:
            false,
        }
      }


      case 'token': {

        /*
         * 容错：
         * 即使 Provider 没有显式先发送 start，
         * 收到第一个 token 时也进入 SPEAKING。
         */
        if (
          !started
        ) {

          started =
            true


          if (
            typeof onStart ===
              'function'
          ) {

            await onStart()
          }
        }


        const token =
          typeof event.content ===
            'string'
            ? event.content
            : ''


        if (
          token
        ) {

          fullReply +=
            token


          if (
            typeof onToken ===
              'function'
          ) {

            onToken(
              token
            )
          }
        }


        return {
          started,
          fullReply,
          done:
            false,
        }
      }


      case 'done': {

        return {
          started,
          fullReply,
          done:
            true,
        }
      }


      case 'error': {

        const error =
          new Error(
            event.message ||
            event.error ||
            'Chat server returned an error'
          )


        error.userMessage =
          event.userMessage ||
          'AI 请求失败，请检查配置。'


        throw error
      }


      default: {

        /*
         * 未知事件忽略。
         * 后面可增加 metadata / usage 等事件。
         */
        return {
          started,
          fullReply,
          done:
            false,
        }
      }
    }
  }


  async readErrorResponse(
    response
  ) {

    try {

      const text =
        await response.text()


      if (!text) {
        return ''
      }


      try {

        const data =
          JSON.parse(
            text
          )


        return (
          data.error ||
          data.message ||
          text
        )

      } catch {

        return text
      }

    } catch {

      return ''
    }
  }


  getUserErrorMessage(
    status
  ) {

    switch (
      status
    ) {

      case 400:
        return 'AI 配置或请求参数不正确。'

      case 401:
        return 'API Key 无效或没有权限。'

      case 403:
        return '当前 API Key 无权使用该模型。'

      case 408:
        return 'AI 请求超时，请稍后重试。'

      case 429:
        return '请求过于频繁，或模型额度已达到限制。'

      case 502:
      case 503:
      case 504:
        return 'AI 服务暂时不可用，请稍后重试。'

      default:
        return '聊天服务暂时不可用。'
    }
  }


  throwIfAborted(
    signal
  ) {

    if (
      !signal?.aborted
    ) {
      return
    }


    throw new DOMException(
      'The operation was aborted.',
      'AbortError'
    )
  }
}