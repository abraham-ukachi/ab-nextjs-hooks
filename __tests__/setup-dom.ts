/** Node 26 exposes a broken global `localStorage` that shadows happy-dom's. */
class MemoryStorage implements Storage {
  #map = new Map<string, string>()
  get length() {
    return this.#map.size
  }
  clear() {
    this.#map.clear()
  }
  getItem(key: string) {
    return this.#map.has(key) ? this.#map.get(key)! : null
  }
  key(index: number) {
    return [...this.#map.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.#map.delete(key)
  }
  setItem(key: string, value: string) {
    this.#map.set(key, String(value))
  }
}

const store = new MemoryStorage()
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  enumerable: true,
  value: store,
})
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  enumerable: true,
  value: store,
})
