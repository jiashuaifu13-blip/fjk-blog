export class PetDataLoader {
  constructor(basePath = '/pets/dsh1') {
    this.basePath = basePath
  }

  async loadJson(fileName) {
    const url = `${this.basePath}/${fileName}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to load ${url}: ${response.status} ${response.statusText}`
      )
    }

    return response.json()
  }

  async load() {
    const [manifest, actions] = await Promise.all([
      this.loadJson('manifest.json'),
      this.loadJson('actions.json'),
    ])

    return {
      manifest,
      actions,
    }
  }
}