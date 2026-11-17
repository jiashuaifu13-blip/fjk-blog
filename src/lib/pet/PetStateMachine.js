import {
  PetStates,
  PetStateConfig,
} from './PetStates.js'


export class PetStateMachine {

  constructor({
    animator,
    config = PetStateConfig,
  }) {

    this.animator =
      animator

    this.config =
      config

    this.currentState =
      PetStates.BOOT

    this.previousState =
      null

    this.transitionToken =
      0

    this.onStateChange =
      null

    this.onStateError =
      null


    /*
     * 动画自然结束时，
     * 状态机决定下一步去哪。
     */

    this.animator.onAnimationEnd =
      async (action) => {

        const stateConfig =
          this.config[
            this.currentState
          ]

        if (
          !stateConfig ||
          !stateConfig.transient
        ) {
          return
        }

        const returnState =
          stateConfig.returnState ??
          PetStates.IDLE

        try {

          await this.setState(
            returnState,
            {
              reason:
                `animation-ended:${action.id}`,
            }
          )

        } catch (error) {

          this.handleError(
            error
          )
        }
      }
  }


  getStateConfig(state) {

    return (
      this.config[state] ??
      null
    )
  }


  canEnter(state) {

    if (
      state ===
      PetStates.BOOT
    ) {
      return false
    }

    return Boolean(
      this.getStateConfig(
        state
      )
    )
  }


  async setState(
    nextState,
    {
      force = false,
      reason = 'manual',
    } = {}
  ) {

    if (
      !this.canEnter(nextState)
    ) {
      throw new Error(
        `Unknown or unavailable pet state: ${nextState}`
      )
    }


    /*
     * 相同状态默认不重新启动动画。
     */

    if (
      !force &&
      nextState ===
      this.currentState
    ) {
      return false
    }


    const token =
      ++this.transitionToken


    const previousState =
      this.currentState


    const stateConfig =
      this.getStateConfig(
        nextState
      )


    try {

      await this.animator.play(
        stateConfig.actionId,
        {
          loop:
            stateConfig.loop,
        }
      )


      /*
       * 如果 await 期间又发生了新的状态切换，
       * 当前这一轮结果作废。
       */

      if (
        token !==
        this.transitionToken
      ) {
        return false
      }


      this.previousState =
        previousState

      this.currentState =
        nextState


      if (
        typeof this.onStateChange ===
        'function'
      ) {

        this.onStateChange({
          from:
            previousState,

          to:
            nextState,

          reason,

          actionId:
            stateConfig.actionId,

          transient:
            Boolean(
              stateConfig.transient
            ),
        })
      }


      return true

    } catch (error) {

      this.handleError(
        error
      )

      throw error
    }
  }


  /*
   * 强制重新播放当前状态。
   */

  async restart() {

    if (
      this.currentState ===
      PetStates.BOOT
    ) {
      return false
    }

    return this.setState(
      this.currentState,
      {
        force: true,
        reason: 'restart',
      }
    )
  }


  /*
   * 回到默认待机状态。
   */

  async idle(
    reason = 'idle'
  ) {

    return this.setState(
      PetStates.IDLE,
      {
        reason,
      }
    )
  }


  handleError(error) {

    console.error(
      'PetStateMachine error:',
      error
    )


    if (
      typeof this.onStateError ===
      'function'
    ) {
      this.onStateError(
        error
      )
    }
  }

}