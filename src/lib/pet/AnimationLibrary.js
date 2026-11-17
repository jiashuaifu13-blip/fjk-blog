export class AnimationLibrary {
  constructor(actionsData) {
    this.actions = new Map()

    const animations =
      actionsData.animations ??
      actionsData.actions ??
      []

    for (const action of animations) {
      if (!action?.id) {
        continue
      }

      this.actions.set(action.id, action)
    }
  }

  get(id) {
    return this.actions.get(id) ?? null
  }

  has(id) {
    return this.actions.has(id)
  }

  getAll() {
    return Array.from(this.actions.values())
  }

  getIds() {
    return Array.from(this.actions.keys())
  }

  get size() {
    return this.actions.size
  }
}