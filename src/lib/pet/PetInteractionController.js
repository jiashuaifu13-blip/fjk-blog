import {
  PetStates,
} from './PetStates.js'


export class PetInteractionController {

  constructor({
    root,
    canvas,
    stateMachine,
    hitTest,

    dragThreshold = 6,

    viewportPadding = 4,

    storageKey =
      'fjk-blog-pet-position-v1',
  }) {

    if (
      !(root instanceof HTMLElement)
    ) {
      throw new Error(
        'PetInteractionController requires a valid root element'
      )
    }


    if (
      !(canvas instanceof HTMLCanvasElement)
    ) {
      throw new Error(
        'PetInteractionController requires a valid canvas'
      )
    }


    this.root =
      root

    this.canvas =
      canvas

    this.stateMachine =
      stateMachine

    this.hitTest =
      hitTest


    this.dragThreshold =
      dragThreshold

    this.viewportPadding =
      viewportPadding

    this.storageKey =
      storageKey


    this.mounted =
      false


    this.pointerId =
      null

    this.pointerType =
      null


    this.pointerDown =
      false

    this.dragging =
      false


    this.startClientX =
      0

    this.startClientY =
      0


    this.startLeft =
      0

    this.startTop =
      0


    /*
     * ==========================================
     * Drag render scheduling
     * ==========================================
     *
     * pointermove 可能远高于屏幕刷新率。
     *
     * 我们不在每一次 pointermove 中
     * 直接修改 DOM。
     *
     * 而是：
     *
     * pointermove
     * → 保存最新目标位置
     * → requestAnimationFrame
     * → 每帧最多更新一次 DOM
     */

    this.pendingLeft =
      null

    this.pendingTop =
      null

    this.dragFrameId =
      null


    /*
     * 用于防止点击桌宠时，
     * 事件穿透到下面的网页元素。
     */
    this.suppressNextClick =
      false


    this.onInteraction =
      null


    /*
     * ==========================================
     * Bind handlers
     * ==========================================
     */

    this.handlePointerDown =
      this.handlePointerDown.bind(
        this
      )

    this.handlePointerMove =
      this.handlePointerMove.bind(
        this
      )

    this.handlePointerUp =
      this.handlePointerUp.bind(
        this
      )

    this.handlePointerCancel =
      this.handlePointerCancel.bind(
        this
      )

    this.handleClick =
      this.handleClick.bind(
        this
      )

    this.handleResize =
      this.handleResize.bind(
        this
      )

    this.handleVisibilityChange =
      this.handleVisibilityChange.bind(
        this
      )

    this.flushDragPosition =
      this.flushDragPosition.bind(
        this
      )
  }


  /*
   * ==========================================
   * Lifecycle
   * ==========================================
   */

  mount() {

    if (
      this.mounted
    ) {
      return
    }


    this.mounted =
      true


    document.addEventListener(
      'pointerdown',
      this.handlePointerDown,
      {
        capture:
          true,

        passive:
          false,
      }
    )


    document.addEventListener(
      'pointermove',
      this.handlePointerMove,
      {
        capture:
          true,

        passive:
          false,
      }
    )


    document.addEventListener(
      'pointerup',
      this.handlePointerUp,
      {
        capture:
          true,

        passive:
          false,
      }
    )


    document.addEventListener(
      'pointercancel',
      this.handlePointerCancel,
      {
        capture:
          true,

        passive:
          false,
      }
    )


    document.addEventListener(
      'click',
      this.handleClick,
      true
    )


    window.addEventListener(
      'resize',
      this.handleResize
    )


    window.addEventListener(
      'orientationchange',
      this.handleResize
    )


    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    )


    requestAnimationFrame(
      () => {

        requestAnimationFrame(
          () => {

            const restored =
              this.restorePosition()


            if (
              !restored
            ) {

              this.clampToViewport()
            }
          }
        )
      }
    )
  }


  unmount() {

    if (
      !this.mounted
    ) {
      return
    }


    this.mounted =
      false


    document.removeEventListener(
      'pointerdown',
      this.handlePointerDown,
      true
    )


    document.removeEventListener(
      'pointermove',
      this.handlePointerMove,
      true
    )


    document.removeEventListener(
      'pointerup',
      this.handlePointerUp,
      true
    )


    document.removeEventListener(
      'pointercancel',
      this.handlePointerCancel,
      true
    )


    document.removeEventListener(
      'click',
      this.handleClick,
      true
    )


    window.removeEventListener(
      'resize',
      this.handleResize
    )


    window.removeEventListener(
      'orientationchange',
      this.handleResize
    )


    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    )


    this.cancelDragFrame()


    this.resetPointer()
  }


  /*
   * ==========================================
   * Interaction events
   * ==========================================
   */

  emitInteraction(
    type,
    extra = {}
  ) {

    if (
      typeof this.onInteraction !==
      'function'
    ) {
      return
    }


    this.onInteraction({
      type,

      pointerType:
        this.pointerType,

      ...extra,
    })
  }


  /*
   * ==========================================
   * Pointer Down
   * ==========================================
   */

  handlePointerDown(
    event
  ) {

    if (
      this.pointerDown
    ) {
      return
    }


    if (
      event.pointerType ===
        'mouse' &&
      event.button !==
        0
    ) {
      return
    }


    const hit =
      this.hitTest.hit(
        event.clientX,
        event.clientY
      )


    if (
      !hit
    ) {

      return
    }


    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    this.pointerDown =
      true


    this.pointerId =
      event.pointerId


    this.pointerType =
      event.pointerType


    this.startClientX =
      event.clientX

    this.startClientY =
      event.clientY


    const rect =
      this.root
        .getBoundingClientRect()


    this.startLeft =
      rect.left

    this.startTop =
      rect.top


    this.dragging =
      false


    this.pendingLeft =
      null

    this.pendingTop =
      null


    this.suppressNextClick =
      true


    this.emitInteraction(
      'pointer-down',
      {
        clientX:
          event.clientX,

        clientY:
          event.clientY,
      }
    )
  }


  /*
   * ==========================================
   * Pointer Move
   * ==========================================
   */

  handlePointerMove(
    event
  ) {

    if (
      !this.pointerDown ||
      event.pointerId !==
        this.pointerId
    ) {
      return
    }


    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    const deltaX =
      event.clientX -
      this.startClientX


    const deltaY =
      event.clientY -
      this.startClientY


    /*
     * 第一次超过阈值：
     *
     * 立即进入 DRAGGING。
     *
     * 不 await。
     */
    if (
      !this.dragging
    ) {

      const distance =
        Math.hypot(
          deltaX,
          deltaY
        )


      if (
        distance <
        this.dragThreshold
      ) {
        return
      }


      this.dragging =
        true


      this.root.dataset.dragging =
        'true'


      this.emitInteraction(
        'drag-start'
      )


      this.stateMachine
        .setState(
          PetStates.DRAGGING,
          {
            force:
              true,

            reason:
              'pointer-drag-start',
          }
        )
        .catch(
          (error) => {

            console.error(
              '[PetInteraction] Failed to enter DRAGGING:',
              error
            )
          }
        )
    }


    /*
     * 只计算目标坐标。
     *
     * 不在这里直接写 DOM。
     */

    const position =
      this.clampPosition(
        this.startLeft +
          deltaX,

        this.startTop +
          deltaY
      )


    this.pendingLeft =
      position.left

    this.pendingTop =
      position.top


    /*
     * 同一个浏览器绘制周期内，
     * 最多安排一个更新任务。
     */

    this.scheduleDragFrame()
  }


  /*
   * ==========================================
   * Drag RAF
   * ==========================================
   */

  scheduleDragFrame() {

    if (
      this.dragFrameId !==
      null
    ) {
      return
    }


    this.dragFrameId =
      requestAnimationFrame(
        this.flushDragPosition
      )
  }


  flushDragPosition() {

    this.dragFrameId =
      null


    if (
      !this.dragging
    ) {
      return
    }


    if (
      this.pendingLeft ===
        null ||
      this.pendingTop ===
        null
    ) {
      return
    }


    const left =
      this.pendingLeft

    const top =
      this.pendingTop


    this.pendingLeft =
      null

    this.pendingTop =
      null


    this.applyPosition(
      left,
      top
    )


    this.emitInteraction(
      'drag-move',
      {
        left,
        top,
      }
    )
  }


  cancelDragFrame() {

    if (
      this.dragFrameId !==
      null
    ) {

      cancelAnimationFrame(
        this.dragFrameId
      )


      this.dragFrameId =
        null
    }


    this.pendingLeft =
      null

    this.pendingTop =
      null
  }


  /*
   * ==========================================
   * Flush final drag position
   * ==========================================
   *
   * 松手时可能刚好还有一帧尚未提交。
   *
   * 这里强制把最后坐标落到 DOM，
   * 避免松手瞬间少掉最后几像素。
   */

  flushFinalDragPosition() {

    if (
      this.dragFrameId !==
      null
    ) {

      cancelAnimationFrame(
        this.dragFrameId
      )


      this.dragFrameId =
        null
    }


    if (
      this.pendingLeft ===
        null ||
      this.pendingTop ===
        null
    ) {
      return
    }


    const left =
      this.pendingLeft

    const top =
      this.pendingTop


    this.pendingLeft =
      null

    this.pendingTop =
      null


    this.applyPosition(
      left,
      top
    )


    this.emitInteraction(
      'drag-move',
      {
        left,
        top,
      }
    )
  }


  /*
   * ==========================================
   * Pointer Up
   * ==========================================
   */

  async handlePointerUp(
    event
  ) {

    if (
      !this.pointerDown ||
      event.pointerId !==
        this.pointerId
    ) {
      return
    }


    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    const wasDragging =
      this.dragging


    if (
      wasDragging
    ) {

      /*
       * 先确保最后一个 pointermove
       * 对应的位置已经提交。
       */
      this.flushFinalDragPosition()


      delete this.root
        .dataset
        .dragging


      this.savePosition()


      this.emitInteraction(
        'drag-end'
      )


      try {

        await this.stateMachine
          .setState(
            PetStates.IDLE,
            {
              force:
                true,

              reason:
                'pointer-drag-end',
            }
          )

      } catch (error) {

        console.error(
          '[PetInteraction] Failed to return to IDLE:',
          error
        )
      }

    } else {

      this.cancelDragFrame()


      this.emitInteraction(
        'click'
      )


      try {

        await this.stateMachine
          .setState(
            PetStates.INTERACT,
            {
              force:
                true,

              reason:
                'pointer-click',
            }
          )

      } catch (error) {

        console.error(
          '[PetInteraction] Failed to enter INTERACT:',
          error
        )
      }
    }


    this.resetPointer()
  }


  /*
   * ==========================================
   * Pointer Cancel
   * ==========================================
   */

  async handlePointerCancel(
    event
  ) {

    if (
      !this.pointerDown ||
      event.pointerId !==
        this.pointerId
    ) {
      return
    }


    event.preventDefault()


    const wasDragging =
      this.dragging


    if (
      wasDragging
    ) {

      this.flushFinalDragPosition()


      delete this.root
        .dataset
        .dragging


      this.savePosition()


      try {

        await this.stateMachine
          .setState(
            PetStates.IDLE,
            {
              force:
                true,

              reason:
                'pointer-drag-cancel',
            }
          )

      } catch (error) {

        console.error(
          '[PetInteraction] Failed to cancel drag:',
          error
        )
      }

    } else {

      this.cancelDragFrame()
    }


    this.emitInteraction(
      'pointer-cancel'
    )


    this.resetPointer()
  }


  /*
   * ==========================================
   * Prevent underlying click
   * ==========================================
   */

  handleClick(
    event
  ) {

    if (
      !this.suppressNextClick
    ) {
      return
    }


    this.suppressNextClick =
      false


    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()
  }


  /*
   * ==========================================
   * Position
   * ==========================================
   */

  clampPosition(
    left,
    top
  ) {

    const rect =
      this.root
        .getBoundingClientRect()


    const width =
      rect.width

    const height =
      rect.height


    const padding =
      this.viewportPadding


    const minLeft =
      padding

    const minTop =
      padding


    const maxLeft =
      Math.max(
        padding,

        window.innerWidth -
        width -
        padding
      )


    const maxTop =
      Math.max(
        padding,

        window.innerHeight -
        height -
        padding
      )


    return {

      left:
        Math.min(
          Math.max(
            left,
            minLeft
          ),
          maxLeft
        ),


      top:
        Math.min(
          Math.max(
            top,
            minTop
          ),
          maxTop
        ),
    }
  }


  applyPosition(
    left,
    top
  ) {

    this.root.style.left =
      `${left}px`

    this.root.style.top =
      `${top}px`


    this.root.style.right =
      'auto'

    this.root.style.bottom =
      'auto'
  }


  clampToViewport() {

    const rect =
      this.root
        .getBoundingClientRect()


    const position =
      this.clampPosition(
        rect.left,
        rect.top
      )


    this.applyPosition(
      position.left,
      position.top
    )


    return position
  }


  /*
   * ==========================================
   * Position persistence
   * ==========================================
   */

  savePosition() {

    const rect =
      this.root
        .getBoundingClientRect()


    const maxX =
      Math.max(
        1,

        window.innerWidth -
        rect.width
      )


    const maxY =
      Math.max(
        1,

        window.innerHeight -
        rect.height
      )


    const data = {

      xRatio:
        rect.left /
        maxX,

      yRatio:
        rect.top /
        maxY,

      savedAt:
        Date.now(),
    }


    try {

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(
          data
        )
      )

    } catch {
      /*
       * localStorage 不可用时
       * 不影响桌宠。
       */
    }
  }


  restorePosition() {

    let data


    try {

      const raw =
        localStorage.getItem(
          this.storageKey
        )


      if (
        !raw
      ) {
        return false
      }


      data =
        JSON.parse(
          raw
        )

    } catch {

      return false
    }


    if (
      !Number.isFinite(
        data?.xRatio
      ) ||
      !Number.isFinite(
        data?.yRatio
      )
    ) {
      return false
    }


    const rect =
      this.root
        .getBoundingClientRect()


    const maxX =
      Math.max(
        0,

        window.innerWidth -
        rect.width
      )


    const maxY =
      Math.max(
        0,

        window.innerHeight -
        rect.height
      )


    const left =
      maxX *
      Math.min(
        Math.max(
          data.xRatio,
          0
        ),
        1
      )


    const top =
      maxY *
      Math.min(
        Math.max(
          data.yRatio,
          0
        ),
        1
      )


    const position =
      this.clampPosition(
        left,
        top
      )


    this.applyPosition(
      position.left,
      position.top
    )


    return true
  }


  clearSavedPosition() {

    try {

      localStorage.removeItem(
        this.storageKey
      )

    } catch {
      // ignore
    }
  }


  /*
   * ==========================================
   * Resize / Orientation
   * ==========================================
   */

  handleResize() {

    requestAnimationFrame(
      () => {

        const position =
          this.clampToViewport()


        this.savePosition()


        this.emitInteraction(
          'viewport-resize',
          position
        )
      }
    )
  }


  /*
   * ==========================================
   * Visibility
   * ==========================================
   */

  async handleVisibilityChange() {

    if (
      document.visibilityState !==
        'hidden' ||
      !this.pointerDown
    ) {
      return
    }


    if (
      this.dragging
    ) {

      this.flushFinalDragPosition()


      delete this.root
        .dataset
        .dragging


      this.savePosition()


      try {

        await this.stateMachine
          .setState(
            PetStates.IDLE,
            {
              force:
                true,

              reason:
                'visibility-hidden',
            }
          )

      } catch (error) {

        console.error(
          '[PetInteraction] Failed to restore IDLE:',
          error
        )
      }

    } else {

      this.cancelDragFrame()
    }


    this.resetPointer()
  }


  /*
   * ==========================================
   * Reset
   * ==========================================
   */

  resetPointer() {

    this.cancelDragFrame()


    this.pointerDown =
      false

    this.dragging =
      false


    this.pointerId =
      null

    this.pointerType =
      null


    delete this.root
      .dataset
      .dragging
  }
}