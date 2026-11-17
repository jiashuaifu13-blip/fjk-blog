export const PetStates = Object.freeze({
  BOOT: 'BOOT',
  IDLE: 'IDLE',
  THINKING: 'THINKING',
  SPEAKING: 'SPEAKING',
  WALKING: 'WALKING',
  INTERACT: 'INTERACT',
  DRAGGING: 'DRAGGING',
  ERROR: 'ERROR',
})


export const PetStateConfig = Object.freeze({

  [PetStates.IDLE]: {
    actionId: '站着晃神打瞌睡',
    loop: true,
    transient: false,
  },

  /*
   * 目前只是状态机测试动作。
   * 后续会重新挑选真正合适的“思考”动作。
   */
  [PetStates.THINKING]: {
    actionId: '中国功夫',
    loop: true,
    transient: false,
  },

  /*
   * 暂时复用“走路”测试 SPEAKING。
   * 后续会更换成真正合适的说话/互动动作。
   */
  [PetStates.SPEAKING]: {
    actionId: '走路',
    loop: true,
    transient: false,
  },

  [PetStates.WALKING]: {
    actionId: '走路',
    loop: true,
    transient: false,
  },

  /*
   * INTERACT 是一次性状态。
   *
   * 动作播放完后自动回到 IDLE。
   */
  [PetStates.INTERACT]: {
    actionId: '中国功夫',
    loop: false,
    transient: true,
    returnState: PetStates.IDLE,
  },

  /*
   * 当前还没有真正拖拽动画，
   * 先保持待机动作。
   */
  [PetStates.DRAGGING]: {
    actionId: '站着晃神打瞌睡',
    loop: true,
    transient: false,
  },

  /*
   * ERROR 暂时也保持角色可见。
   * 后面可以专门挑一个错误/疑惑动作。
   */
  [PetStates.ERROR]: {
    actionId: '站着晃神打瞌睡',
    loop: true,
    transient: false,
  },

})