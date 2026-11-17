export class PetAudioManager {
  constructor(basePath = '/pets/dsh1') {
    this.basePath = basePath

    this.audio = null
    this.objectUrl = null

    this.currentActionId = null
  }

  getAudioPath(action) {
    return (
      action?.audio ??
      action?.sources?.audio ??
      null
    )
  }

  hasAudio(action) {
    return Boolean(
      this.getAudioPath(action)
    )
  }

  async prepare(action) {
    await this.stop()

    const audioPath =
      this.getAudioPath(action)

    if (!audioPath) {
      return false
    }

    const url =
      `${this.basePath}/${audioPath}`

    const response =
      await fetch(url)

    if (!response.ok) {
      throw new Error(
        `无法加载音频：${url} ` +
        `(${response.status})`
      )
    }

    const blob =
      await response.blob()

    this.objectUrl =
      URL.createObjectURL(blob)

    this.audio =
      new Audio(this.objectUrl)

    this.audio.preload = 'auto'
    this.audio.style.display = 'none'

    document.body.appendChild(
      this.audio
    )

    this.currentActionId =
      action.id

    await new Promise(
      (resolve, reject) => {
        const handleReady = () => {
          cleanup()
          resolve()
        }

        const handleError = () => {
          cleanup()

          reject(
            new Error(
              `音频初始化失败：${action.id}`
            )
          )
        }

        const cleanup = () => {
          this.audio?.removeEventListener(
            'canplay',
            handleReady
          )

          this.audio?.removeEventListener(
            'error',
            handleError
          )
        }

        this.audio.addEventListener(
          'canplay',
          handleReady,
          {
            once: true,
          }
        )

        this.audio.addEventListener(
          'error',
          handleError,
          {
            once: true,
          }
        )

        this.audio.load()
      }
    )

    return true
  }

  async play() {
    if (!this.audio) {
      return false
    }

    this.audio.currentTime = 0

    await this.audio.play()

    return true
  }

  pause() {
    if (!this.audio) {
      return
    }

    this.audio.pause()
  }

  async resume() {
    if (!this.audio) {
      return false
    }

    await this.audio.play()

    return true
  }

  async stop() {
    if (this.audio) {
      this.audio.pause()

      this.audio.removeAttribute(
        'src'
      )

      this.audio.load()
      this.audio.remove()

      this.audio = null
    }

    if (this.objectUrl) {
      URL.revokeObjectURL(
        this.objectUrl
      )

      this.objectUrl = null
    }

    this.currentActionId = null
  }

  get currentTime() {
    return (
      this.audio?.currentTime ??
      0
    )
  }

  get duration() {
    const duration =
      this.audio?.duration

    return Number.isFinite(duration)
      ? duration
      : 0
  }

  get ended() {
    return Boolean(
      this.audio?.ended
    )
  }

  get isPlaying() {
    return Boolean(
      this.audio &&
      !this.audio.paused &&
      !this.audio.ended
    )
  }
}