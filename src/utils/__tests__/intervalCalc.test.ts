import { describe, it, expect } from 'vitest'
import { calculateInterval } from '../intervalCalc'

/**
 * Helper para criar datas de teste de forma clara.
 * Mês é 1-indexed (1 = Janeiro) para facilitar a leitura.
 */
function d(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  return new Date(year, month - 1, day, hour, minute)
}

/** Helper para criar data com segundos */
function ds(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): Date {
  return new Date(year, month - 1, day, hour, minute, second)
}

// ============================================================
// 1. SEGUNDOS
// ============================================================
describe('seconds', () => {
  it('1 segundo', () => {
    expect(calculateInterval(ds(2024, 1, 1, 0, 0, 0), ds(2024, 1, 1, 0, 0, 1), 'seconds')).toBe(
      '1s',
    )
  })
  it('59 segundos', () => {
    expect(calculateInterval(ds(2024, 1, 1, 0, 0, 0), ds(2024, 1, 1, 0, 0, 59), 'seconds')).toBe(
      '59s',
    )
  })
  it('60 segundos = 1 minuto cheio', () => {
    expect(calculateInterval(ds(2024, 1, 1, 0, 0, 0), ds(2024, 1, 1, 0, 1, 0), 'seconds')).toBe(
      '60s',
    )
  })
  it('3600 segundos = 1 hora cheia', () => {
    expect(calculateInterval(ds(2024, 1, 1, 0, 0, 0), ds(2024, 1, 1, 1, 0, 0), 'seconds')).toBe(
      '3600s',
    )
  })
  it('86400 segundos = 1 dia cheio', () => {
    expect(calculateInterval(ds(2024, 1, 1, 0, 0, 0), ds(2024, 1, 2, 0, 0, 0), 'seconds')).toBe(
      '86400s',
    )
  })
})

// ============================================================
// 2. MINUTOS
// ============================================================
describe('minutes', () => {
  it('1 minuto', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 10, 1), 'minutes')).toBe('1m')
  })
  it('59 minutos', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 10, 59), 'minutes')).toBe('59m')
  })
  it('60 minutos = 1 hora', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 11, 0), 'minutes')).toBe('60m')
  })
  it('1440 minutos = 1 dia', () => {
    expect(calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 2, 0, 0), 'minutes')).toBe('1440m')
  })
  it('ignora segundos (30s a mais não muda resultado)', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), ds(2024, 1, 1, 10, 1, 30), 'minutes')).toBe('1m')
  })
})

// ============================================================
// 3. HORAS
// ============================================================
describe('hours', () => {
  it('1 hora', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 1, 11), 'hours')).toBe('1h')
  })
  it('23 horas', () => {
    expect(calculateInterval(d(2024, 1, 1, 0), d(2024, 1, 1, 23), 'hours')).toBe('23h')
  })
  it('24 horas = 1 dia', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 2, 10), 'hours')).toBe('24h')
  })
  it('168 horas = 1 semana', () => {
    expect(calculateInterval(d(2024, 1, 1, 0), d(2024, 1, 8, 0), 'hours')).toBe('168h')
  })
  it('ignora minutos', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 30), d(2024, 1, 1, 12, 45), 'hours')).toBe('2h')
  })
})

// ============================================================
// 4. DIAS
// ============================================================
describe('days', () => {
  it('1 dia', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 2), 'days')).toBe('1d')
  })
  it('30 dias (janeiro)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 31), 'days')).toBe('30d')
  })
  it('31 dias (janeiro cheio)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 2, 1), 'days')).toBe('31d')
  })
  it('60 dias (jan-mar, ano bissexto)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 3, 1), 'days')).toBe('60d')
  })
  it('366 dias (ano bissexto)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2025, 1, 1), 'days')).toBe('366d')
  })
  it('365 dias (ano normal)', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 1, 1), 'days')).toBe('365d')
  })
  it('floor: 23:59 → 00:01 = 0d (2 minutos, não chega a 1 dia)', () => {
    expect(calculateInterval(d(2024, 1, 1, 23, 59), d(2024, 1, 2, 0, 1), 'days')).toBe('0d')
  })
})

// ============================================================
// 5. HORAS-MINUTOS
// ============================================================
describe('hours-minutes', () => {
  it('0h 1m', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 10, 1), 'hours-minutes')).toBe(
      '0h 1m',
    )
  })
  it('1h 0m', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 11, 0), 'hours-minutes')).toBe(
      '1h 0m',
    )
  })
  it('23h 59m', () => {
    expect(calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 1, 23, 59), 'hours-minutes')).toBe(
      '23h 59m',
    )
  })
  it('24h 0m = 1 dia cheio', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 2, 10, 0), 'hours-minutes')).toBe(
      '24h 0m',
    )
  })
  it('25h 30m', () => {
    expect(calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 2, 1, 30), 'hours-minutes')).toBe(
      '25h 30m',
    )
  })
  it('intervalo muito curto: 0h 1m', () => {
    expect(calculateInterval(d(2024, 6, 15, 12, 0), d(2024, 6, 15, 12, 1), 'hours-minutes')).toBe(
      '0h 1m',
    )
  })
})

// ============================================================
// 6. DIAS-HORAS
// ============================================================
describe('days-hours', () => {
  it('0d 1h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 1, 11), 'days-hours')).toBe('0d 1h')
  })
  it('1d 0h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 2, 10), 'days-hours')).toBe('1d 0h')
  })
  it('1d 1h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 2, 11), 'days-hours')).toBe('1d 1h')
  })
  it('30d 0h (janeiro inteiro)', () => {
    expect(calculateInterval(d(2024, 1, 1, 0), d(2024, 1, 31, 0), 'days-hours')).toBe('30d 0h')
  })
  it('ignora minutos: 10:45 → 11:15 = 1d 0h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10, 45), d(2024, 1, 2, 11, 15), 'days-hours')).toBe(
      '1d 0h',
    )
  })
})

// ============================================================
// 7. DIAS-HORAS-MINUTOS
// ============================================================
describe('days-hours-minutes', () => {
  it('0d 0h 1m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 10, 1), 'days-hours-minutes'),
    ).toBe('0d 0h 1m')
  })
  it('1d 0h 0m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 2, 10, 0), 'days-hours-minutes'),
    ).toBe('1d 0h 0m')
  })
  it('2d 3h 15m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 3, 13, 15), 'days-hours-minutes'),
    ).toBe('2d 3h 15m')
  })
  it('0d 23h 59m (quase 1 dia)', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 1, 23, 59), 'days-hours-minutes'),
    ).toBe('0d 23h 59m')
  })
  it('31d 0h 0m (janeiro inteiro)', () => {
    expect(calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 2, 1, 0, 0), 'days-hours-minutes')).toBe(
      '31d 0h 0m',
    )
  })
})

// ============================================================
// 8. SEMANAS
// ============================================================
describe('weeks', () => {
  it('0w (menos de 7 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 7), 'weeks')).toBe('0w')
  })
  it('1w (exatamente 7 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 8), 'weeks')).toBe('1w')
  })
  it('2w (14 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 15), 'weeks')).toBe('2w')
  })
  it('4w (28 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 29), 'weeks')).toBe('4w')
  })
  it('52w (364 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 12, 30), 'weeks')).toBe('52w')
  })
  it('52w (366 dias, bissexto — 366/7 = 52.28, floor = 52)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2025, 1, 1), 'weeks')).toBe('52w')
  })
})

// ============================================================
// 9. SEMANAS-DIAS
// ============================================================
describe('weeks-days', () => {
  it('0w 1d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 2), 'weeks-days')).toBe('0w 1d')
  })
  it('0w 6d (quase 1 semana)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 7), 'weeks-days')).toBe('0w 6d')
  })
  it('1w 0d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 8), 'weeks-days')).toBe('1w 0d')
  })
  it('1w 3d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 11), 'weeks-days')).toBe('1w 3d')
  })
  it('4w 1d (29 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 30), 'weeks-days')).toBe('4w 1d')
  })
  it('52w 2d (366 dias, bissexto)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2025, 1, 1), 'weeks-days')).toBe('52w 2d')
  })
  it('52w 1d (365 dias, normal)', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 1, 1), 'weeks-days')).toBe('52w 1d')
  })
})

// ============================================================
// 10. SEMANAS-DIAS-HORAS
// ============================================================
describe('weeks-days-hours', () => {
  it('0w 0d 1h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 1, 11), 'weeks-days-hours')).toBe(
      '0w 0d 1h',
    )
  })
  it('0w 6d 23h (quase 7 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 7, 23, 59), 'weeks-days-hours')).toBe(
      '0w 6d 23h',
    )
  })
  it('1w 0d 0h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 8, 10), 'weeks-days-hours')).toBe(
      '1w 0d 0h',
    )
  })
  it('1w 2d 5h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 10, 15), 'weeks-days-hours')).toBe(
      '1w 2d 5h',
    )
  })
  it('2w 0d 0h (14 dias)', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 1, 15, 10), 'weeks-days-hours')).toBe(
      '2w 0d 0h',
    )
  })
  it('ignora minutos: 10:45 → 11:15 em 2 dias = 0w 2d 0h', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 45), d(2024, 1, 3, 11, 15), 'weeks-days-hours'),
    ).toBe('0w 2d 0h')
  })
})

// ============================================================
// 11. SEMANAS-DIAS-HORAS-MINUTOS
// ============================================================
describe('weeks-days-hours-minutes', () => {
  it('0w 0d 0h 1m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 10, 1), 'weeks-days-hours-minutes'),
    ).toBe('0w 0d 0h 1m')
  })
  it('0w 6d 23h 59m (quase 7 dias)', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 7, 23, 59), 'weeks-days-hours-minutes'),
    ).toBe('0w 6d 23h 59m')
  })
  it('1w 0d 0h 0m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 8, 10, 0), 'weeks-days-hours-minutes'),
    ).toBe('1w 0d 0h 0m')
  })
  it('2w 0d 0h 0m (14 dias)', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 15, 10, 0), 'weeks-days-hours-minutes'),
    ).toBe('2w 0d 0h 0m')
  })
  it('1w 2d 3h 30m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 10, 13, 30), 'weeks-days-hours-minutes'),
    ).toBe('1w 2d 3h 30m')
  })
})

// ============================================================
// 12. MESES
// ============================================================
describe('months', () => {
  it('0M (menos de 1 mês)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 31), 'months')).toBe('0M')
  })
  it('1M (jan → fev)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 2, 1), 'months')).toBe('1M')
  })
  it('11M (jan → dez)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 12, 1), 'months')).toBe('11M')
  })
  it('12M = 1 ano', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2025, 1, 1), 'months')).toBe('12M')
  })
  it('24M = 2 anos', () => {
    expect(calculateInterval(d(2022, 1, 1), d(2024, 1, 1), 'months')).toBe('24M')
  })
})

// ============================================================
// 13. MESES-DIAS
// ============================================================
describe('months-days', () => {
  it('0M 1d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 2), 'months-days')).toBe('0M 1d')
  })
  it('1M 0d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 2, 1), 'months-days')).toBe('1M 0d')
  })
  it('1M 15d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 2, 16), 'months-days')).toBe('1M 15d')
  })
  it('11M 29d (quase 1 ano, bissexto)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 12, 30), 'months-days')).toBe('11M 29d')
  })
  it('11M 30d (quase 1 ano, normal)', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2023, 12, 31), 'months-days')).toBe('11M 30d')
  })
})

// ============================================================
// 14. MESES-DIAS-HORAS
// ============================================================
describe('months-days-hours', () => {
  it('0M 0d 1h', () => {
    expect(calculateInterval(d(2024, 1, 1, 8), d(2024, 1, 1, 9), 'months-days-hours')).toBe(
      '0M 0d 1h',
    )
  })
  it('1M 0d 0h', () => {
    expect(calculateInterval(d(2024, 1, 1, 10), d(2024, 2, 1, 10), 'months-days-hours')).toBe(
      '1M 0d 0h',
    )
  })
  it('2M 5d 10h', () => {
    expect(calculateInterval(d(2024, 1, 1, 8), d(2024, 3, 6, 18), 'months-days-hours')).toBe(
      '2M 5d 10h',
    )
  })
  it('ignora minutos: 10:45 → 11:15 = 1M 0d 0h', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 45), d(2024, 2, 1, 11, 15), 'months-days-hours'),
    ).toBe('1M 0d 0h')
  })
})

// ============================================================
// 15. MESES-DIAS-HORAS-MINUTOS
// ============================================================
describe('months-days-hours-minutes', () => {
  it('0M 0d 0h 1m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 1, 1, 10, 1), 'months-days-hours-minutes'),
    ).toBe('0M 0d 0h 1m')
  })
  it('1M 0d 0h 0m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 2, 1, 10, 0), 'months-days-hours-minutes'),
    ).toBe('1M 0d 0h 0m')
  })
  it('1M 10d 5h 30m', () => {
    expect(
      calculateInterval(d(2024, 1, 1, 10, 0), d(2024, 2, 11, 15, 30), 'months-days-hours-minutes'),
    ).toBe('1M 10d 5h 30m')
  })
})

// ============================================================
// 16. ANOS
// ============================================================
describe('years', () => {
  it('0y (menos de 1 ano)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 12, 31), 'years')).toBe('0y')
  })
  it('1y', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 1, 1), 'years')).toBe('1y')
  })
  it('2y', () => {
    expect(calculateInterval(d(2022, 3, 15), d(2024, 3, 15), 'years')).toBe('2y')
  })
  it('10y', () => {
    expect(calculateInterval(d(2014, 1, 1), d(2024, 1, 1), 'years')).toBe('10y')
  })
  it('100y (um século)', () => {
    expect(calculateInterval(d(1924, 1, 1), d(2024, 1, 1), 'years')).toBe('100y')
  })
})

// ============================================================
// 17. ANOS-MESES
// ============================================================
describe('years-months', () => {
  it('0y 0M', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 31), 'years-months')).toBe('0y 0M')
  })
  it('0y 6M', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 7, 1), 'years-months')).toBe('0y 6M')
  })
  it('1y 0M', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 1, 1), 'years-months')).toBe('1y 0M')
  })
  it('1y 6M', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 7, 1), 'years-months')).toBe('1y 6M')
  })
  it('5y 11M (quase 6 anos)', () => {
    expect(calculateInterval(d(2018, 2, 1), d(2024, 1, 1), 'years-months')).toBe('5y 11M')
  })
})

// ============================================================
// 18. ANOS-MESES-DIAS
// ============================================================
describe('years-months-days', () => {
  it('1y 0M 0d', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 1, 1), 'years-months-days')).toBe('1y 0M 0d')
  })
  it('1y 1M 1d', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 2, 2), 'years-months-days')).toBe('1y 1M 1d')
  })
  it('2y 3M 10d', () => {
    expect(calculateInterval(d(2022, 1, 1), d(2024, 4, 11), 'years-months-days')).toBe('2y 3M 10d')
  })
})

// ============================================================
// 19. ANOS-MESES-DIAS-HORAS
// ============================================================
describe('years-months-days-hours', () => {
  it('1y 0M 0d 0h', () => {
    expect(calculateInterval(d(2023, 1, 1, 10), d(2024, 1, 1, 10), 'years-months-days-hours')).toBe(
      '1y 0M 0d 0h',
    )
  })
  it('1y 2M 5d 8h', () => {
    expect(calculateInterval(d(2023, 1, 1, 10), d(2024, 3, 6, 18), 'years-months-days-hours')).toBe(
      '1y 2M 5d 8h',
    )
  })
  it('ignora minutos: 10:30 → 11:45 = 2y 0M 1d 1h', () => {
    expect(
      calculateInterval(d(2022, 6, 15, 10, 30), d(2024, 6, 16, 11, 45), 'years-months-days-hours'),
    ).toBe('2y 0M 1d 1h')
  })
})

// ============================================================
// 20. ANOS-MESES-DIAS-HORAS-MINUTOS
// ============================================================
describe('years-months-days-hours-minutes', () => {
  it('1y 0M 0d 0h 0m', () => {
    expect(
      calculateInterval(
        d(2024, 1, 1, 10, 30),
        d(2025, 1, 1, 10, 30),
        'years-months-days-hours-minutes',
      ),
    ).toBe('1y 0M 0d 0h 0m')
  })
  it('0y 11M 30d 23h 59m (quase 1 ano, bissexto)', () => {
    expect(
      calculateInterval(
        d(2024, 1, 1, 0, 0),
        d(2024, 12, 31, 23, 59),
        'years-months-days-hours-minutes',
      ),
    ).toBe('0y 11M 30d 23h 59m')
  })
  it('0y 11M 30d 23h 59m (quase 1 ano, normal)', () => {
    expect(
      calculateInterval(
        d(2023, 1, 1, 0, 0),
        d(2023, 12, 31, 23, 59),
        'years-months-days-hours-minutes',
      ),
    ).toBe('0y 11M 30d 23h 59m')
  })
  it('10y 0M 0d 0h 0m', () => {
    expect(
      calculateInterval(
        d(2014, 6, 15, 8, 0),
        d(2024, 6, 15, 8, 0),
        'years-months-days-hours-minutes',
      ),
    ).toBe('10y 0M 0d 0h 0m')
  })
})

// ============================================================
// ANOS BISSEXTO — casos extensivos
// ============================================================
describe('anos bissexto', () => {
  it('2024 (bissexto): fev tem 29 dias', () => {
    expect(calculateInterval(d(2024, 2, 1), d(2024, 3, 1), 'days')).toBe('29d')
  })

  it('2023 (normal): fev tem 28 dias', () => {
    expect(calculateInterval(d(2023, 2, 1), d(2023, 3, 1), 'days')).toBe('28d')
  })

  it('2000 (bissexto por divisão por 400): fev tem 29 dias', () => {
    expect(calculateInterval(d(2000, 2, 1), d(2000, 3, 1), 'days')).toBe('29d')
  })

  it('1900 (NÃO bissexto — divisão por 100 mas não por 400): fev tem 28 dias', () => {
    expect(calculateInterval(d(1900, 2, 1), d(1900, 3, 1), 'days')).toBe('28d')
  })

  it('2100 (NÃO bissexto — divisão por 100 mas não por 400): fev tem 28 dias', () => {
    expect(calculateInterval(d(2100, 2, 1), d(2100, 3, 1), 'days')).toBe('28d')
  })

  it('2020 (bissexto): 366 dias no ano', () => {
    expect(calculateInterval(d(2020, 1, 1), d(2021, 1, 1), 'days')).toBe('366d')
  })

  it('29 fev 2024 → 1 mar 2024 = 1 dia', () => {
    expect(calculateInterval(d(2024, 2, 29), d(2024, 3, 1), 'days')).toBe('1d')
  })

  it('28 fev 2023 → 1 mar 2023 = 1 dia', () => {
    expect(calculateInterval(d(2023, 2, 28), d(2023, 3, 1), 'days')).toBe('1d')
  })

  it('29 fev 2024 → 29 fev 2028 = 4 anos (com 1 bissexto no meio)', () => {
    expect(calculateInterval(d(2024, 2, 29), d(2028, 2, 29), 'years-months-days')).toBe('4y 0M 0d')
  })

  it('365 dias entre 2 anos bissexto = 52w 1d', () => {
    expect(calculateInterval(d(2023, 1, 1), d(2024, 1, 1), 'weeks-days')).toBe('52w 1d')
  })

  it('366 dias em ano bissexto = 52w 2d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2025, 1, 1), 'weeks-days')).toBe('52w 2d')
  })
})

// ============================================================
// MESES COM DIFERENTES QUANTIDADES DE DIAS
// ============================================================
describe('meses com diferentes dias', () => {
  it('jan (31d): 1 jan → 1 fev = 31d', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 2, 1), 'days')).toBe('31d')
  })
  it('fev bissexto (29d): 1 fev → 1 mar = 29d', () => {
    expect(calculateInterval(d(2024, 2, 1), d(2024, 3, 1), 'days')).toBe('29d')
  })
  it('fev normal (28d): 1 fev → 1 mar = 28d', () => {
    expect(calculateInterval(d(2023, 2, 1), d(2023, 3, 1), 'days')).toBe('28d')
  })
  it('mar (31d): 1 mar → 1 abr = 31d', () => {
    expect(calculateInterval(d(2024, 3, 1), d(2024, 4, 1), 'days')).toBe('31d')
  })
  it('abr (30d): 1 abr → 1 mai = 30d', () => {
    expect(calculateInterval(d(2024, 4, 1), d(2024, 5, 1), 'days')).toBe('30d')
  })
  it('mai (31d): 1 mai → 1 jun = 31d', () => {
    expect(calculateInterval(d(2024, 5, 1), d(2024, 6, 1), 'days')).toBe('31d')
  })
  it('jun (30d): 1 jun → 1 jul = 30d', () => {
    expect(calculateInterval(d(2024, 6, 1), d(2024, 7, 1), 'days')).toBe('30d')
  })
  it('jul (31d): 1 jul → 1 ago = 31d', () => {
    expect(calculateInterval(d(2024, 7, 1), d(2024, 8, 1), 'days')).toBe('31d')
  })
  it('ago (31d): 1 ago → 1 set = 31d', () => {
    expect(calculateInterval(d(2024, 8, 1), d(2024, 9, 1), 'days')).toBe('31d')
  })
  it('set (30d): 1 set → 1 out = 30d', () => {
    expect(calculateInterval(d(2024, 9, 1), d(2024, 10, 1), 'days')).toBe('30d')
  })
  it('out (31d): 1 out → 1 nov = 31d', () => {
    expect(calculateInterval(d(2024, 10, 1), d(2024, 11, 1), 'days')).toBe('31d')
  })
  it('nov (30d): 1 nov → 1 dez = 30d', () => {
    expect(calculateInterval(d(2024, 11, 1), d(2024, 12, 1), 'days')).toBe('30d')
  })
  it('dez (31d): 1 dez → 1 jan = 31d', () => {
    expect(calculateInterval(d(2024, 12, 1), d(2025, 1, 1), 'days')).toBe('31d')
  })

  it('12 meses = 1 ano (jan→jan)', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2025, 1, 1), 'months')).toBe('12M')
  })
  it('12 meses = 1 ano (fev→fev, bissexto)', () => {
    expect(calculateInterval(d(2024, 2, 1), d(2025, 2, 1), 'months')).toBe('12M')
  })

  it('31 dez → 31 jan = 1M 0d', () => {
    expect(calculateInterval(d(2024, 12, 31), d(2025, 1, 31), 'months-days')).toBe('1M 0d')
  })

  it('28 fev → 28 mar (bissexto) = 1M 0d', () => {
    expect(calculateInterval(d(2024, 2, 28), d(2024, 3, 28), 'months-days')).toBe('1M 0d')
  })
})

// ============================================================
// TRANSIÇÕES DE MEIA-NOITE
// ============================================================
describe('transições de meia-noite', () => {
  it('23:59 → 00:00 = 1 minuto', () => {
    expect(calculateInterval(d(2024, 1, 1, 23, 59), d(2024, 1, 2, 0, 0), 'minutes')).toBe('1m')
  })
  it('23:00 → 01:00 = 2 horas', () => {
    expect(calculateInterval(d(2024, 1, 1, 23, 0), d(2024, 1, 2, 1, 0), 'hours')).toBe('2h')
  })
  it('23:00 → 01:00 = 0d 2h', () => {
    expect(calculateInterval(d(2024, 1, 1, 23, 0), d(2024, 1, 2, 1, 0), 'days-hours')).toBe('0d 2h')
  })
  it('meia-noite → meia-noite = 1 dia', () => {
    expect(calculateInterval(d(2024, 1, 1, 0, 0), d(2024, 1, 2, 0, 0), 'days')).toBe('1d')
  })
  it('31 dez 23:59 → 1 jan 00:00 = 1m', () => {
    expect(calculateInterval(d(2024, 12, 31, 23, 59), d(2025, 1, 1, 0, 0), 'minutes')).toBe('1m')
  })
})

// ============================================================
// INTERVALOS MUITO CURTOS
// ============================================================
describe('intervalos muito curtos', () => {
  it('1s no modo seconds', () => {
    expect(
      calculateInterval(ds(2024, 6, 15, 12, 30, 0), ds(2024, 6, 15, 12, 30, 1), 'seconds'),
    ).toBe('1s')
  })
  it('1m no modo minutes', () => {
    expect(calculateInterval(d(2024, 6, 15, 12, 30), d(2024, 6, 15, 12, 31), 'minutes')).toBe('1m')
  })
  it('1h no modo hours', () => {
    expect(calculateInterval(d(2024, 6, 15, 12, 30), d(2024, 6, 15, 13, 30), 'hours')).toBe('1h')
  })
  it('1d no modo days', () => {
    expect(calculateInterval(d(2024, 6, 15, 12, 30), d(2024, 6, 16, 12, 30), 'days')).toBe('1d')
  })
  it('1w no modo weeks (7d)', () => {
    expect(calculateInterval(d(2024, 6, 15), d(2024, 6, 22), 'weeks')).toBe('1w')
  })
})

// ============================================================
// INTERVALOS MUITO EXTENSOS
// ============================================================
describe('intervalos muito extensos', () => {
  it('10 anos em days (2014-2024, 2 bissextos: 2016, 2020 = 3652d)', () => {
    expect(calculateInterval(d(2014, 1, 1), d(2024, 1, 1), 'days')).toBe('3652d')
  })
  it('20 anos em months', () => {
    expect(calculateInterval(d(2004, 1, 1), d(2024, 1, 1), 'months')).toBe('240M')
  })
  it('5 anos em weeks (2019-2024 = 1826d, 1826/7 = 260w)', () => {
    expect(calculateInterval(d(2019, 1, 1), d(2024, 1, 1), 'weeks')).toBe('260w')
  })
  it('1 século em years', () => {
    expect(calculateInterval(d(1924, 1, 1), d(2024, 1, 1), 'years')).toBe('100y')
  })
  it('50 anos em years-months-days', () => {
    expect(calculateInterval(d(1974, 6, 15), d(2024, 6, 15), 'years-months-days')).toBe('50y 0M 0d')
  })
  it('1 milhão de segundos ≈ 11d 13h 46m', () => {
    const start = d(2024, 1, 1, 0, 0)
    const end = new Date(start.getTime() + 1_000_000 * 1000)
    expect(calculateInterval(start, end, 'days-hours-minutes')).toBe('11d 13h 46m')
  })
})

// ============================================================
// ERROS
// ============================================================
describe('erros', () => {
  it('deve lançar erro se startDate > endDate', () => {
    expect(() => calculateInterval(d(2024, 1, 2), d(2024, 1, 1), 'days')).toThrow(
      'startDate must be before endDate',
    )
  })
  it('deve retornar 0d para startDate === endDate', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 1), 'days')).toBe('0d')
  })
  it('deve retornar 0s para mesmo instante em seconds', () => {
    expect(calculateInterval(d(2024, 1, 1), d(2024, 1, 1), 'seconds')).toBe('0s')
  })
})

// ============================================================
// CONSISTÊNCIA — mesma duração, unidades diferentes
// ============================================================
describe('consistência entre unidades', () => {
  it('24h deve ser equivalente a 1d', () => {
    const start = d(2024, 1, 1, 10)
    const end = d(2024, 1, 2, 10)
    expect(calculateInterval(start, end, 'hours')).toBe('24h')
    expect(calculateInterval(start, end, 'days')).toBe('1d')
    expect(calculateInterval(start, end, 'days-hours')).toBe('1d 0h')
  })

  it('7d deve ser equivalente a 1w', () => {
    const start = d(2024, 1, 1)
    const end = d(2024, 1, 8)
    expect(calculateInterval(start, end, 'days')).toBe('7d')
    expect(calculateInterval(start, end, 'weeks')).toBe('1w')
    expect(calculateInterval(start, end, 'weeks-days')).toBe('1w 0d')
  })

  it('12M deve ser equivalente a 1y', () => {
    const start = d(2023, 3, 1)
    const end = d(2024, 3, 1)
    expect(calculateInterval(start, end, 'months')).toBe('12M')
    expect(calculateInterval(start, end, 'years')).toBe('1y')
    expect(calculateInterval(start, end, 'years-months')).toBe('1y 0M')
  })

  it('60m deve ser equivalente a 1h', () => {
    const start = d(2024, 1, 1, 10, 0)
    const end = d(2024, 1, 1, 11, 0)
    expect(calculateInterval(start, end, 'minutes')).toBe('60m')
    expect(calculateInterval(start, end, 'hours')).toBe('1h')
    expect(calculateInterval(start, end, 'hours-minutes')).toBe('1h 0m')
  })
})
