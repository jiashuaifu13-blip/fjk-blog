export class PetHitTest {

  constructor({
    canvas,
    alphaThreshold = 25,
  }) {

    if (
      !(canvas instanceof
        HTMLCanvasElement)
    ) {
      throw new Error(
        'PetHitTest requires a valid canvas'
      )
    }


    this.canvas =
      canvas


    this.alphaThreshold =
      alphaThreshold


    this.ctx =
      canvas.getContext(
        '2d',
        {
          willReadFrequently:
            true,
        }
      )


    if (!this.ctx) {
      throw new Error(
        'Failed to create Canvas 2D context for hit testing'
      )
    }
  }


  /*
   * ==========================================
   * Browser coordinate
   * →
   * Canvas pixel coordinate
   * ==========================================
   */

  clientToCanvas(
    clientX,
    clientY
  ) {

    const rect =
      this.canvas
        .getBoundingClientRect()


    if (
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return null
    }


    const localX =
      clientX -
      rect.left


    const localY =
      clientY -
      rect.top


    /*
     * Pointer 不在 Canvas
     * 显示矩形范围内。
     */
    if (
      localX < 0 ||
      localY < 0 ||
      localX >= rect.width ||
      localY >= rect.height
    ) {
      return null
    }


    /*
     * CSS 可能已经缩放 Canvas。
     *
     * 所以浏览器显示坐标必须
     * 映射回 Canvas 内部像素。
     */
    const scaleX =
      this.canvas.width /
      rect.width


    const scaleY =
      this.canvas.height /
      rect.height


    const x =
      Math.floor(
        localX *
        scaleX
      )


    const y =
      Math.floor(
        localY *
        scaleY
      )


    if (
      x < 0 ||
      y < 0 ||
      x >= this.canvas.width ||
      y >= this.canvas.height
    ) {
      return null
    }


    return {
      x,
      y,
    }
  }


  /*
   * ==========================================
   * 正式命中接口
   * ==========================================
   *
   * PetInteractionController
   * 当前调用：
   *
   * this.hitTest.hit(...)
   *
   * 所以 hit() 是这里的主接口。
   */

  hit(
    clientX,
    clientY
  ) {

    const point =
      this.clientToCanvas(
        clientX,
        clientY
      )


    if (!point) {
      return false
    }


    try {

      const pixel =
        this.ctx.getImageData(
          point.x,
          point.y,
          1,
          1
        )


      const alpha =
        pixel.data[3]


      return (
        alpha >
        this.alphaThreshold
      )

    } catch (error) {

      /*
       * 如果未来使用了跨域图片，
       * Canvas 可能被 taint。
       *
       * 当前 dsh1 是同源资源，
       * 正常不会进入这里。
       */
      console.warn(
        '[PetHitTest] Failed to read canvas pixel:',
        error
      )


      return false
    }
  }


  /*
   * ==========================================
   * Compatibility aliases
   * ==========================================
   *
   * 保留这些方法，
   * 防止以后其他代码使用了不同命名。
   */

  hitTest(
    clientX,
    clientY
  ) {

    return this.hit(
      clientX,
      clientY
    )
  }


  isHit(
    clientX,
    clientY
  ) {

    return this.hit(
      clientX,
      clientY
    )
  }


  contains(
    clientX,
    clientY
  ) {

    return this.hit(
      clientX,
      clientY
    )
  }
}