export class PetRenderer {

  constructor(
    canvas
  ) {

    if (
      !(canvas instanceof
        HTMLCanvasElement)
    ) {
      throw new Error(
        'PetRenderer requires a valid canvas'
      )
    }


    this.canvas =
      canvas


    /*
     * PetHitTest 会频繁读取像素。
     *
     * 提前告诉浏览器：
     * 这个 Canvas 会经常调用
     * getImageData()。
     */
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
        'Failed to create Canvas 2D context'
      )
    }


    this.image =
      null

    this.action =
      null
  }


  setAnimation(
    action,
    image
  ) {

    this.action =
      action

    this.image =
      image


    const {
      frameWidth,
      frameHeight,
    } =
      action.spritesheet


    /*
     * Canvas 内部继续使用
     * 原始动画帧尺寸。
     *
     * CSS 只负责视觉缩放。
     */
    this.canvas.width =
      frameWidth

    this.canvas.height =
      frameHeight
  }


  clear() {

    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }


  renderFrame(
    frame
  ) {

    if (
      !this.action ||
      !this.image
    ) {
      return
    }


    const {
      frameWidth,
      frameHeight,
      columns,
    } =
      this.action.spritesheet


    const column =
      frame % columns


    const row =
      Math.floor(
        frame / columns
      )


    const sourceX =
      column *
      frameWidth


    const sourceY =
      row *
      frameHeight


    this.clear()


    this.ctx.drawImage(
      this.image,

      sourceX,
      sourceY,

      frameWidth,
      frameHeight,

      0,
      0,

      this.canvas.width,
      this.canvas.height
    )
  }
}