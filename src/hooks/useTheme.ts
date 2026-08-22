import { useCallback, useEffect, useState } from 'react'
import LocalStorageUtil from '../utils/LocalStorage'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'themeMode'

/**
 * Hook para gerenciar o tema do app (claro/escuro).
 * Salva a preferência no LocalStorage.
 */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(
    (LocalStorageUtil.getItem(STORAGE_KEY) as ThemeMode) ?? 'light',
  )

  const applyTheme = useCallback((themeMode: ThemeMode) => {
    const body = document.body

    body.classList.remove('ion-palette-dark')

    if (themeMode === 'dark') {
      body.classList.add('ion-palette-dark')
    }
  }, [])

  // Aplicar tema ao montar
  useEffect(() => {
    applyTheme(mode)
  }, [applyTheme, mode])

  const cycleMode = useCallback(() => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setModeState(next)
    LocalStorageUtil.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }, [mode, applyTheme])

  const icon = mode === 'light' ? 'sunny' : 'moon'
  const label = mode === 'light' ? 'Claro' : 'Escuro'

  return { mode, cycleMode, icon, label }
}
