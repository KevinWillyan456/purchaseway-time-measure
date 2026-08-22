import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.className = ''
  })

  afterEach(() => {
    document.body.className = ''
  })

  it('deve retornar tema light por padrão', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.mode).toBe('light')
    expect(result.current.icon).toBe('sunny')
    expect(result.current.label).toBe('Claro')
  })

  it('deve retornar tema dark quando salvo no localStorage', () => {
    localStorage.setItem('themeMode', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.mode).toBe('dark')
    expect(result.current.icon).toBe('moon')
    expect(result.current.label).toBe('Escuro')
  })

  it('deve alternar de light para dark ao chamar cycleMode', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.cycleMode()
    })

    expect(result.current.mode).toBe('dark')
    expect(result.current.icon).toBe('moon')
    expect(result.current.label).toBe('Escuro')
  })

  it('deve alternar de dark para light ao chamar cycleMode', () => {
    localStorage.setItem('themeMode', 'dark')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.cycleMode()
    })

    expect(result.current.mode).toBe('light')
    expect(result.current.icon).toBe('sunny')
    expect(result.current.label).toBe('Claro')
  })

  it('deve salvar a preferência no localStorage ao alternar', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.cycleMode()
    })

    expect(localStorage.getItem('themeMode')).toBe('dark')
  })

  it('deve adicionar a classe ion-palette-dark no body para tema dark', () => {
    localStorage.setItem('themeMode', 'dark')

    renderHook(() => useTheme())

    expect(document.body.classList.contains('ion-palette-dark')).toBe(true)
  })

  it('deve remover a classe ion-palette-dark do body para tema light', () => {
    document.body.classList.add('ion-palette-dark')

    renderHook(() => useTheme())

    expect(document.body.classList.contains('ion-palette-dark')).toBe(false)
  })
})
