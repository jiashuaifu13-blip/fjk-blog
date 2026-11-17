export class PetAnimator {
  constructor({
    renderer,
    library,
    cache,
    audioManager = null,
  }) {
    this.renderer = renderer
    this.library = library
    this.cache = cache

    this.audioManager =
      audioManager

    this.currentAction = null
    this.currentFrame = 0

    this.running = false
    this.looping = true

    this.startTime = 0
    this.animationFrameId = null

    this.usingAudioClock = false

    this.playToken = 0

    this.onAnimationChange = null
    this.onAnimationEnd = null
    this.onError = null
  }

  async play(
    actionId,
    {
      loop = true,
    } = {}
  ) {
    const token =
      ++this.playToken

    const action =
      this.library.get(actionId)

    if (!action) {
      throw new Error(
        `Unknown animation: ${actionId}`
      )
    }

    /*
     * 先加载精灵图。
     */

    const image =
      await this.cache.load(action)

    if (
      token !==
      this.playToken
    ) {
      return
    }

    /*
     * 停止前一个动画和音频。
     */

    this.stopAnimationLoop()

    if (this.audioManager) {
      await this.audioManager.stop()
    }

    if (
      token !==
      this.playToken
    ) {
      return
    }

    this.currentAction =
      action

    this.currentFrame =
      0

    this.looping =
      loop

    this.running =
      true

    this.usingAudioClock =
      false

    this.renderer.setAnimation(
      action,
      image
    )

    this.renderer.renderFrame(0)

    /*
     * 检查动作是否具有音频。
     */

    if (
      this.audioManager &&
      this.audioManager.hasAudio(action)
    ) {
      try {
        const prepared =
          await this.audioManager.prepare(
            action
          )

        if (
          token !==
          this.playToken
        ) {
          return
        }

        if (prepared) {
          /*
           * 音频动作默认不循环。
           *
           * 因为音频本身通常只有一次。
           */
          this.looping = false

          await this.audioManager.play()

          this.usingAudioClock =
            true
        }
      } catch (error) {
        console.error(
          '音频加载失败，回退到普通动画时钟：',
          error
        )

        /*
         * 音频失败不能导致动画失败。
         */

        this.usingAudioClock =
          false
      }
    }

    this.startTime =
      performance.now()

    if (
      typeof this.onAnimationChange ===
      'function'
    ) {
      this.onAnimationChange(
        action,
        {
          hasAudio:
            Boolean(
              this.audioManager?.hasAudio(
                action
              )
            ),

          usingAudioClock:
            this.usingAudioClock,
        }
      )
    }

    this.loop()
  }

  stopAnimationLoop() {
    this.running = false

    if (
      this.animationFrameId !==
      null
    ) {
      cancelAnimationFrame(
        this.animationFrameId
      )

      this.animationFrameId =
        null
    }
  }

  async stop() {
    ++this.playToken

    this.stopAnimationLoop()

    if (this.audioManager) {
      await this.audioManager.stop()
    }

    this.currentAction = null
    this.currentFrame = 0

    this.usingAudioClock =
      false
  }

  getElapsedSeconds() {
    /*
     * 有音频：
     *
     * 音频本身就是时间轴。
     */

    if (
      this.usingAudioClock &&
      this.audioManager
    ) {
      return (
        this.audioManager.currentTime
      )
    }

    /*
     * 没有音频：
     *
     * 使用 performance.now()
     */

    return (
      performance.now() -
      this.startTime
    ) / 1000
  }

  loop = () => {
    if (
      !this.running ||
      !this.currentAction
    ) {
      return
    }

    try {
      const {
        fps,
        frameCount,
      } =
        this.currentAction
          .spritesheet

      const elapsedSeconds =
        this.getElapsedSeconds()

      let frame =
        Math.floor(
          elapsedSeconds * fps
        )

      /*
       * 音频动作：
       *
       * 如果音频结束，
       * 动画也结束。
       */

      if (
        this.usingAudioClock &&
        this.audioManager?.ended
      ) {
        this.finishAnimation()
        return
      }

      if (this.looping) {
        frame =
          frame % frameCount
      } else {
        if (
          frame >=
          frameCount
        ) {
          this.finishAnimation()
          return
        }
      }

      if (
        frame !==
        this.currentFrame
      ) {
        this.currentFrame =
          frame

        this.renderer.renderFrame(
          frame
        )
      }

      this.animationFrameId =
        requestAnimationFrame(
          this.loop
        )
    } catch (error) {
      console.error(
        '动画循环异常：',
        error
      )

      this.running = false

      if (
        typeof this.onError ===
        'function'
      ) {
        this.onError(error)
      }
    }
  }

  finishAnimation() {
    this.running = false

    const action =
      this.currentAction

    const {
      frameCount,
    } =
      action.spritesheet

    /*
     * 停留在最后一帧。
     */

    this.currentFrame =
      frameCount - 1

    this.renderer.renderFrame(
      this.currentFrame
    )

    if (
      typeof this.onAnimationEnd ===
      'function'
    ) {
      this.onAnimationEnd(
        action
      )
    }
  }
}