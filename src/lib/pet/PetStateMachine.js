import {
  PetStates,
  PetStateConfig,
} from "./PetStates.js";


export class PetStateMachine {

  constructor({
    animator,
    actionSelector,
    config =
      PetStateConfig,
  }) {

    if (
      !animator
    ) {

      throw new Error(
        "PetStateMachine requires animator"
      );
    }


    if (
      !actionSelector
    ) {

      throw new Error(
        "PetStateMachine requires actionSelector"
      );
    }


    this.animator =
      animator;

    this.actionSelector =
      actionSelector;

    this.config =
      config;


    this.currentState =
      PetStates.BOOT;

    this.previousState =
      null;

    this.currentAction =
      null;

    this.previousAction =
      null;


    this.transitionToken =
      0;


    this.onStateChange =
      null;

    this.onStateError =
      null;


    /*
     * ========================================================
     * Animation End
     * ========================================================
     */

    this.animator.onAnimationEnd =
      async (action) => {

        const state =
          this.currentState;


        const stateConfig =
          this.getStateConfig(
            state
          );


        if (
          !stateConfig
        ) {
          return;
        }


        try {

          /*
           * ----------------------------------------------------
           * IDLE Rotation
           * ----------------------------------------------------
           *
           * 一个待机动作自然结束后，
           * 强制重新进入 IDLE，
           * 让 Selector 自动选择另一个待机动作。
           */
          if (
            stateConfig.rotateOnEnd
          ) {

            await this.setState(
              state,
              {
                force:
                  true,

                reason:
                  `animation-rotate:${action.id}`,
              }
            );


            return;
          }


          /*
           * ----------------------------------------------------
           * Transient State
           * ----------------------------------------------------
           *
           * INTERACT
           * EMOTION
           * REACTION
           * SPECIAL
           *
           * 播放结束后自动回到指定状态。
           */
          if (
            stateConfig.transient
          ) {

            const returnState =
              stateConfig.returnState ??
              PetStates.IDLE;


            await this.setState(
              returnState,
              {
                force:
                  returnState ===
                  this.currentState,

                reason:
                  `animation-ended:${action.id}`,
              }
            );
          }

        } catch (error) {

          this.handleError(
            error
          );
        }
      };
  }


  /*
   * ==========================================================
   * Configuration
   * ==========================================================
   */

  getStateConfig(
    state
  ) {

    return (
      this.config[
        state
      ] ??
      null
    );
  }


  canEnter(
    state
  ) {

    if (
      state ===
      PetStates.BOOT
    ) {
      return false;
    }


    return Boolean(
      this.getStateConfig(
        state
      )
    );
  }


  /*
   * ==========================================================
   * Action Resolution
   * ==========================================================
   */

  resolveAction(
    state,
    {
      tags = [],
      actionId = null,
      avoidRepeat = true,
    } = {}
  ) {

    if (
      actionId
    ) {

      return this
        .actionSelector
        .selectById(
          actionId
        );
    }


    return this
      .actionSelector
      .select({
        state,
        tags,
        avoidRepeat,
      });
  }


  /*
   * ==========================================================
   * State Transition
   * ==========================================================
   */

  async setState(
    nextState,
    {
      force = false,
      reason = "manual",
      tags = [],
      actionId = null,
      avoidRepeat = true,
      startFrame = 0,
      endFrame = null,
    } = {}
  ) {

    if (
      !this.canEnter(
        nextState
      )
    ) {

      throw new Error(
        `Unknown or unavailable pet state: ${nextState}`
      );
    }


    /*
     * 相同状态默认不重新启动动画。
     *
     * IDLE 自动轮换等情况会传 force: true。
     */
    if (
      !force &&
      nextState ===
      this.currentState
    ) {

      return false;
    }


    const token =
      ++this.transitionToken;


    const previousState =
      this.currentState;


    const previousAction =
      this.currentAction;


    const stateConfig =
      this.getStateConfig(
        nextState
      );


    let action;


    try {

      action =
        this.resolveAction(
          nextState,
          {
            tags,
            actionId,
            avoidRepeat,
          }
        );


      const loop =
        action.loop ??
        stateConfig.loop;


      await this.animator.play(
        action.id,
        {
          loop,

          startFrame,

          endFrame,
        }
      );


      /*
       * 如果 await animator.play() 期间
       * 又发生了新的状态切换，
       * 当前这一轮结果作废。
       */
      if (
        token !==
        this.transitionToken
      ) {

        return false;
      }


      this.previousState =
        previousState;


      this.currentState =
        nextState;


      this.previousAction =
        previousAction;


      this.currentAction =
        action;


      if (
        typeof this.onStateChange ===
        "function"
      ) {

        this.onStateChange({

          from:
            previousState,

          to:
            nextState,

          reason,

          actionId:
            action.id,

          action,

          tags:
            [
              ...action.tags,
            ],

          transient:
            Boolean(
              stateConfig.transient
            ),

          loop:
            Boolean(
              loop
            ),
        });
      }


      return true;

    } catch (error) {

      this.handleError(
        error
      );


      throw error;
    }
  }


  /*
   * ==========================================================
   * Direct Action Playback
   * ==========================================================
   *
   * 开发测试用途。
   *
   * 例如：
   *
   * stateMachine.playAction(
   *   "蓝鲸现世"
   * )
   */
  async playAction(
    actionId,
    {
      state =
        PetStates.SPECIAL,

      loop =
        false,

      returnState =
        PetStates.IDLE,

      reason =
        "direct-action",

      startFrame =
        0,

      endFrame =
        null,

    } = {}
  ) {

    const action =
      this.actionSelector
        .selectById(
          actionId
        );


    const previousState =
      this.currentState;


    const previousAction =
      this.currentAction;


    const token =
      ++this.transitionToken;


    try {

      await this.animator.play(
        action.id,
        {
          loop:
            action.loop ??
            loop,

          startFrame,

          endFrame,
        }
      );


      if (
        token !==
        this.transitionToken
      ) {

        return false;
      }


      this.previousState =
        previousState;


      this.currentState =
        state;


      this.previousAction =
        previousAction;


      this.currentAction =
        action;


      if (
        typeof this.onStateChange ===
        "function"
      ) {

        this.onStateChange({

          from:
            previousState,

          to:
            state,

          reason,

          actionId:
            action.id,

          action,

          tags:
            [
              ...action.tags,
            ],

          transient:
            !loop,

          loop,
        });
      }


      /*
       * Direct action 如果是一次性动画，
       * 由 animator.onAnimationEnd 的状态配置处理。
       *
       * SPECIAL 默认就是 transient，
       * 所以会自动回 IDLE。
       */
      if (
        !loop &&
        state !==
        PetStates.INTERACT &&
        state !==
        PetStates.EMOTION &&
        state !==
        PetStates.REACTION &&
        state !==
        PetStates.SPECIAL
      ) {

        this.currentState =
          PetStates.SPECIAL;
      }


      return true;

    } catch (error) {

      this.handleError(
        error
      );


      /*
       * 尝试恢复原状态。
       */
      if (
        returnState &&
        this.canEnter(
          returnState
        )
      ) {

        try {

          await this.setState(
            returnState,
            {
              force:
                true,

              reason:
                "direct-action-error-recovery",
            }
          );

        } catch {
          // 保留原始错误。
        }
      }


      throw error;
    }
  }


  /*
   * ==========================================================
   * Restart
   * ==========================================================
   */

  async restart() {

    if (
      this.currentState ===
      PetStates.BOOT
    ) {

      return false;
    }


    return this.setState(
      this.currentState,
      {
        force:
          true,

        reason:
          "restart",
      }
    );
  }


  /*
   * ==========================================================
   * Idle
   * ==========================================================
   */

  async idle(
    reason =
      "idle"
  ) {

    return this.setState(
      PetStates.IDLE,
      {
        force:
          this.currentState ===
          PetStates.IDLE,

        reason,
      }
    );
  }


  /*
   * ==========================================================
   * Convenience Helpers
   * ==========================================================
   */

  async think(
    tags = []
  ) {

    return this.setState(
      PetStates.THINKING,
      {
        force:
          true,

        reason:
          "thinking",

        tags,
      }
    );
  }


  async speak(
    tags = []
  ) {

    return this.setState(
      PetStates.SPEAKING,
      {
        force:
          true,

        reason:
          "speaking",

        tags,
      }
    );
  }


  async interact(
    tags = []
  ) {

    return this.setState(
      PetStates.INTERACT,
      {
        force:
          true,

        reason:
          "interaction",

        tags,
      }
    );
  }


  async emotion(
    tags = []
  ) {

    return this.setState(
      PetStates.EMOTION,
      {
        force:
          true,

        reason:
          "emotion",

        tags,
      }
    );
  }


  async reaction(
    tags = []
  ) {

    return this.setState(
      PetStates.REACTION,
      {
        force:
          true,

        reason:
          "reaction",

        tags,
      }
    );
  }


  async special(
    tags = []
  ) {

    return this.setState(
      PetStates.SPECIAL,
      {
        force:
          true,

        reason:
          "special",

        tags,
      }
    );
  }


  /*
   * ==========================================================
   * Error
   * ==========================================================
   */

  handleError(
    error
  ) {

    console.error(
      "PetStateMachine error:",
      error
    );


    if (
      typeof this.onStateError ===
      "function"
    ) {

      this.onStateError(
        error
      );
    }
  }

}