export class MockChatClient {

  constructor({
    thinkingDelay = 900,
    tokenDelay = 42,
  } = {}) {

    this.thinkingDelay =
      thinkingDelay

    this.tokenDelay =
      tokenDelay
  }


  async send({
    message,
    signal,
    onStart,
    onToken,
  }) {

    await this.sleep(
      this.thinkingDelay,
      signal
    )


    this.throwIfAborted(
      signal
    )


    const reply =
      `这是当前博客桌宠的 Mock AI 测试回复。你刚才说的是：“${message}”。现在正在验证 fjksp.cn 的聊天界面、流式输出，以及桌宠的思考与说话状态切换。`


    if (
      typeof onStart ===
      'function'
    ) {
      onStart()
    }


    const tokens =
      Array.from(
        reply
      )


    for (
      const token of tokens
    ) {

      this.throwIfAborted(
        signal
      )


      await this.sleep(
        this.tokenDelay,
        signal
      )


      if (
        typeof onToken ===
        'function'
      ) {
        onToken(
          token
        )
      }
    }


    return reply
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


  sleep(
    duration,
    signal
  ) {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (
          signal?.aborted
        ) {

          reject(
            new DOMException(
              'The operation was aborted.',
              'AbortError'
            )
          )

          return
        }


        const timer =
          window.setTimeout(
            () => {

              cleanup()

              resolve()

            },
            duration
          )


        const handleAbort =
          () => {

            window.clearTimeout(
              timer
            )


            cleanup()


            reject(
              new DOMException(
                'The operation was aborted.',
                'AbortError'
              )
            )
          }


        const cleanup =
          () => {

            signal?.removeEventListener(
              'abort',
              handleAbort
            )
          }


        signal?.addEventListener(
          'abort',
          handleAbort,
          {
            once:
              true,
          }
        )
      }
    )
  }
}