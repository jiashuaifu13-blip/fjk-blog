export const PetStates =
  Object.freeze({

    BOOT:
      "BOOT",

    IDLE:
      "IDLE",

    THINKING:
      "THINKING",

    SPEAKING:
      "SPEAKING",

    WALKING:
      "WALKING",

    INTERACT:
      "INTERACT",

    EMOTION:
      "EMOTION",

    REACTION:
      "REACTION",

    SPECIAL:
      "SPECIAL",

    DRAGGING:
      "DRAGGING",

    ERROR:
      "ERROR",
  });


/*
 * ============================================================
 * State Configuration
 * ============================================================
 *
 * 注意：
 *
 * 这里 artık 不再绑定具体 actionId。
 *
 * 具体动作由：
 *
 * PetActionSelector
 *
 * 根据当前 State / Tags 动态选择。
 */
export const PetStateConfig =
  Object.freeze({

    /*
     * 普通待机。
     *
     * IDLE 动作播放一遍后，
     * 自动重新选择另一个 IDLE 动作。
     */
    [PetStates.IDLE]: {

      loop:
        false,

      transient:
        false,

      rotateOnEnd:
        true,
    },


    /*
     * AI 等待 Provider 返回时。
     *
     * 选择一个 THINKING 动作后循环播放，
     * 直到 ChatController 切换状态。
     */
    [PetStates.THINKING]: {

      loop:
        true,

      transient:
        false,

      rotateOnEnd:
        false,
    },


    /*
     * AI 正在流式输出回答。
     */
    [PetStates.SPEAKING]: {

      loop:
        true,

      transient:
        false,

      rotateOnEnd:
        false,
    },


    /*
     * 行走 / 移动状态。
     */
    [PetStates.WALKING]: {

      loop:
        true,

      transient:
        false,

      rotateOnEnd:
        false,
    },


    /*
     * 点击桌宠触发。
     *
     * 动作结束后回到 IDLE。
     */
    [PetStates.INTERACT]: {

      loop:
        false,

      transient:
        true,

      rotateOnEnd:
        false,

      returnState:
        PetStates.IDLE,
    },


    /*
     * 情绪表现。
     *
     * 以后 AI emotion 会使用：
     *
     * happy
     * angry
     * surprised
     * shy
     * sad
     * ...
     */
    [PetStates.EMOTION]: {

      loop:
        false,

      transient:
        true,

      rotateOnEnd:
        false,

      returnState:
        PetStates.IDLE,
    },


    /*
     * 突发反应动画。
     */
    [PetStates.REACTION]: {

      loop:
        false,

      transient:
        true,

      rotateOnEnd:
        false,

      returnState:
        PetStates.IDLE,
    },


    /*
     * 节日、吃东西、魔术、演奏等特殊演出。
     */
    [PetStates.SPECIAL]: {

      loop:
        false,

      transient:
        true,

      rotateOnEnd:
        false,

      returnState:
        PetStates.IDLE,
    },


    /*
     * 拖拽期间固定播放拖拽反馈动作。
     */
    [PetStates.DRAGGING]: {

      loop:
        true,

      transient:
        false,

      rotateOnEnd:
        false,
    },


    /*
     * AI / 动画发生错误时。
     */
    [PetStates.ERROR]: {

      loop:
        true,

      transient:
        false,

      rotateOnEnd:
        false,
    },
  });