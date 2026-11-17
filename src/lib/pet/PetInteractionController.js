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
     * 当桌宠覆盖在链接 / 按钮上时，
     * pointerdown 已经被我们拦截，
     * 浏览器之后仍有可能生成 click。
     *
     * 用这个标记拦掉那一次 click，
     * 防止点桌宠同时点到下面的链接。
     */
    this.suppressNextClick =
      false


    this.onInteraction =
      null


    /*
     * 绑定函数，方便 mount / unmount。
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


    /*
     * 关键设计：
     *
     * Canvas / root 自身 pointer-events:none。
     *
     * 因此透明矩形不会阻挡博客。
     *
     * 我们从 document 捕获 Pointer Events，
     * 再通过 Alpha hit-test 判断：
     *
     * - 命中角色实体：
     *   拦截事件，交给桌宠。
     *
     * - 命中透明区域：
     *   什么都不做，
     *   浏览器继续把事件交给下面的网页。
     */

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


    /*
     * 阻止点桌宠时触发下面元素的 click。
     */
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


    /*
     * CSS / Canvas 尺寸完成后
     * 再恢复位置。
     */
    requestAnimationFrame(
      () => {

        requestAnimationFrame(
          () => {

            const restored =
              this.restorePosition()


            if (!restored) {
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

  async handlePointerDown(
    event
  ) {

    /*
     * 同时只处理一个 pointer。
     */
    if (
      this.pointerDown
    ) {
      return
    }


    /*
     * 鼠标只响应左键。
     *
     * touch / pen 的 button
     * 行为可能不同，因此只限制 mouse。
     */
    if (
      event.pointerType ===
        'mouse' &&
      event.button !==
        0
    ) {
      return
    }


    /*
     * 最关键的一步：
     * 只有 Alpha 真正命中桌宠
     * 才接管这次事件。
     */
    const hit =
      this.hitTest.hit(
        event.clientX,
        event.clientY
      )


    if (
      !hit
    ) {

      /*
       * 透明区域：
       *
       * 不 preventDefault
       * 不 stopPropagation
       *
       * 下面的博客链接、按钮、
       * 滚动、文本选择全部照常。
       */

      return
    }


    /*
     * 点中角色实体。
     *
     * 从这里开始，
     * 这次 Pointer 归桌宠所有。
     */

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

  async handlePointerMove(
    event
  ) {

    if (
      !this.pointerDown ||
      event.pointerId !==
        this.pointerId
    ) {
      return
    }


    /*
     * 当前 Pointer 已由桌宠接管。
     */
    event.preventDefault()

    event.stopPropagation()

    event.stopImmediatePropagation()


    const deltaX =
      event.clientX -
      this.startClientX


    const deltaY =
      event.clientY -
      this.startClientY


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


      try {

        await this.stateMachine
          .setState(
            PetStates.DRAGGING,
            {
              force:
                true,

              reason:
                'pointer-drag-start',
            }
          )

      } catch (error) {

        console.error(
          '[PetInteraction] Failed to enter DRAGGING:',
          error
        )
      }
    }


    const position =
      this.clampPosition(
        this.startLeft +
          deltaX,

        this.startTop +
          deltaY
      )


    this.applyPosition(
      position.left,
      position.top
    )


    this.emitInteraction(
      'drag-move',
      {
        left:
          position.left,

        top:
          position.top,
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

      /*
       * 没达到拖动距离，
       * 视为点击桌宠。
       */

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


    /*
     * 一旦开始使用 left/top，
     * 就解除默认 right/bottom 定位。
     */
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


    /*
     * 使用相对于可用区域的比例，
     * 而不是只保存绝对 px。
     *
     * 这样桌面缩放到手机、
     * 手机横竖屏切换后，
     * 位置更容易保持合理。
     */

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
       * localStorage 不可用时，
       * 不影响桌宠本身。
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


      if (!raw) {
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

    /*
     * 浏览器 resize /
     * 手机旋转之后 CSS 尺寸可能变化，
     * 等布局完成后再修正。
     */

    requestAnimationFrame(
      () => {

        const position =
          this.clampToViewport()


        /*
         * 更新为新的屏幕比例。
         */
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
   * Tab visibility
   * ==========================================
   */

  async handleVisibilityChange() {

    /*
     * 用户在拖动期间切换标签页，
     * 避免状态永久卡在 DRAGGING。
     */

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
    }


    this.resetPointer()
  }


  /*
   * ==========================================
   * Reset
   * ==========================================
   */

  resetPointer() {

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