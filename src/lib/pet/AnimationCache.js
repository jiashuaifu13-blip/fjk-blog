export class AnimationCache {
  constructor(basePath = '/pets/dsh1') {
    this.basePath = basePath

    this.cache = new Map()
    this.loading = new Map()
  }

  getUrl(action) {
    return `${this.basePath}/${action.sources.webp}`
  }

  has(actionId) {
    return this.cache.has(actionId)
  }

  get(actionId) {
    return this.cache.get(actionId) ?? null
  }

  async load(action) {
    if (!action?.id) {
      throw new Error('Invalid animation action')
    }

    if (this.cache.has(action.id)) {
      return this.cache.get(action.id)
    }

    if (this.loading.has(action.id)) {
      return this.loading.get(action.id)
    }

    const promise =
      this.loadImage(this.getUrl(action))
        .then((image) => {
          this.cache.set(action.id, image)
          this.loading.delete(action.id)

          return image
        })
        .catch((error) => {
          this.loading.delete(action.id)
          throw error
        })

    this.loading.set(
      action.id,
      promise
    )

    return promise
  }

  loadImage(url) {
    return new Promise(
      (resolve, reject) => {
        const image = new Image()

        image.onload = () => {
          resolve(image)
        }

        image.onerror = () => {
          reject(
            new Error(
              `Failed to load animation image: ${url}`
            )
          )
        }

        image.src = url
      }
    )
  }

  clear() {
    this.cache.clear()
    this.loading.clear()
  }

  get size() {
    return this.cache.size
  }
}