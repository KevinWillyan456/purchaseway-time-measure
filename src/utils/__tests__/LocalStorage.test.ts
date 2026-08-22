import { describe, it, expect, beforeEach } from 'vitest'
import LocalStorageUtil from '../LocalStorage'

describe('LocalStorageUtil', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setItem / getItem', () => {
    it('deve armazenar e recuperar um valor', () => {
      LocalStorageUtil.setItem('timeUnit', 'days')
      expect(LocalStorageUtil.getItem('timeUnit')).toBe('days')
    })

    it('deve sobrescrever um valor existente', () => {
      LocalStorageUtil.setItem('timeUnit', 'hours')
      LocalStorageUtil.setItem('timeUnit', 'minutes')
      expect(LocalStorageUtil.getItem('timeUnit')).toBe('minutes')
    })

    it('deve retornar null quando a chave não existe', () => {
      expect(LocalStorageUtil.getItem('timeUnit')).toBeNull()
    })

    it('deve funcionar com startIntervalType', () => {
      LocalStorageUtil.setItem('startIntervalType', 'weekly')
      expect(LocalStorageUtil.getItem('startIntervalType')).toBe('weekly')
    })

    it('deve funcionar com themeMode', () => {
      LocalStorageUtil.setItem('themeMode', 'dark')
      expect(LocalStorageUtil.getItem('themeMode')).toBe('dark')
    })
  })

  describe('removeItem', () => {
    it('deve remover um item existente', () => {
      LocalStorageUtil.setItem('timeUnit', 'days')
      LocalStorageUtil.removeItem('timeUnit')
      expect(LocalStorageUtil.getItem('timeUnit')).toBeNull()
    })

    it('não deve lançar erro ao remover item inexistente', () => {
      expect(() => {
        LocalStorageUtil.removeItem('timeUnit')
      }).not.toThrow()
    })
  })
})
