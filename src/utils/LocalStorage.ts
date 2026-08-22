type LocalStorageKey = 'timeUnit' | 'startIntervalType' | 'themeMode'

class LocalStorageUtil {
  static setItem(key: LocalStorageKey, value: string): void {
    localStorage.setItem(key, value)
  }

  static getItem(key: LocalStorageKey): string | null {
    return localStorage.getItem(key)
  }

  static removeItem(key: LocalStorageKey): void {
    localStorage.removeItem(key)
  }
}

export default LocalStorageUtil
