import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  intervalToDuration,
} from 'date-fns'

export type TimeUnit =
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'hours-minutes'
  | 'days-hours'
  | 'days-hours-minutes'
  | 'weeks'
  | 'weeks-days'
  | 'weeks-days-hours'
  | 'weeks-days-hours-minutes'
  | 'months'
  | 'months-days'
  | 'months-days-hours'
  | 'months-days-hours-minutes'
  | 'years'
  | 'years-months'
  | 'years-months-days'
  | 'years-months-days-hours'
  | 'years-months-days-hours-minutes'

function getUnitSuffix(unit: TimeUnit): string {
  if (unit.includes('minutes')) return 'm'
  if (unit.includes('hours')) return 'h'
  if (unit.includes('days')) return 'd'
  if (unit.includes('weeks')) return 'w'
  if (unit.includes('months')) return 'M'
  if (unit.includes('years')) return 'y'
  if (unit === 'seconds') return 's'
  return ''
}

export function calculateInterval(startDate: Date, endDate: Date, unitOfTime: TimeUnit): string {
  if (startDate > endDate) {
    throw new Error('startDate must be before endDate')
  }

  if (startDate.getTime() === endDate.getTime()) {
    return '0' + getUnitSuffix(unitOfTime)
  }

  const duration = intervalToDuration({ start: startDate, end: endDate })

  const years = duration.years || 0
  const months = duration.months || 0

  switch (unitOfTime) {
    case 'days': {
      const totalDays = differenceInDays(endDate, startDate)
      return `${totalDays}d`
    }
    case 'hours': {
      const totalHours = differenceInHours(endDate, startDate)
      return `${totalHours}h`
    }
    case 'minutes': {
      const totalMinutes = differenceInMinutes(endDate, startDate)
      return `${totalMinutes}m`
    }
    case 'seconds': {
      const totalSeconds = differenceInSeconds(endDate, startDate)
      return `${totalSeconds}s`
    }
    case 'hours-minutes': {
      const totalMinutes = differenceInMinutes(endDate, startDate)
      const h = Math.floor(totalMinutes / 60)
      const m = totalMinutes % 60
      return `${h}h ${m}m`
    }
    case 'days-hours': {
      const totalHours = differenceInHours(endDate, startDate)
      const d = Math.floor(totalHours / 24)
      const h = totalHours % 24
      return `${d}d ${h}h`
    }
    case 'days-hours-minutes': {
      const totalMins = differenceInMinutes(endDate, startDate)
      const d = Math.floor(totalMins / (24 * 60))
      const h = Math.floor((totalMins % (24 * 60)) / 60)
      const m = totalMins % 60
      return `${d}d ${h}h ${m}m`
    }
    case 'weeks': {
      const totalDays = differenceInDays(endDate, startDate)
      const w = Math.floor(totalDays / 7)
      return `${w}w`
    }
    case 'weeks-days': {
      const totalDays = differenceInDays(endDate, startDate)
      const w = Math.floor(totalDays / 7)
      const d = totalDays % 7
      return `${w}w ${d}d`
    }
    case 'weeks-days-hours': {
      const totalHours = differenceInHours(endDate, startDate)
      const w = Math.floor(totalHours / (7 * 24))
      const remainingAfterWeeks = totalHours % (7 * 24)
      const d = Math.floor(remainingAfterWeeks / 24)
      const h = remainingAfterWeeks % 24
      return `${w}w ${d}d ${h}h`
    }
    case 'weeks-days-hours-minutes': {
      const totalMins = differenceInMinutes(endDate, startDate)
      const w = Math.floor(totalMins / (7 * 24 * 60))
      const remainingAfterWeeks = totalMins % (7 * 24 * 60)
      const d = Math.floor(remainingAfterWeeks / (24 * 60))
      const remainingAfterDays = remainingAfterWeeks % (24 * 60)
      const h = Math.floor(remainingAfterDays / 60)
      const m = remainingAfterDays % 60
      return `${w}w ${d}d ${h}h ${m}m`
    }
    case 'months': {
      const totalMonths = years * 12 + months
      return `${totalMonths}M`
    }
    case 'months-days': {
      const days = duration.days || 0
      return `${months}M ${days}d`
    }
    case 'months-days-hours': {
      const days = duration.days || 0
      const hours = duration.hours || 0
      return `${months}M ${days}d ${hours}h`
    }
    case 'months-days-hours-minutes': {
      const days = duration.days || 0
      const hours = duration.hours || 0
      const minutes = duration.minutes || 0
      return `${months}M ${days}d ${hours}h ${minutes}m`
    }
    case 'years': {
      return `${years}y`
    }
    case 'years-months': {
      return `${years}y ${months}M`
    }
    case 'years-months-days': {
      const days = duration.days || 0
      return `${years}y ${months}M ${days}d`
    }
    case 'years-months-days-hours': {
      const days = duration.days || 0
      const hours = duration.hours || 0
      return `${years}y ${months}M ${days}d ${hours}h`
    }
    case 'years-months-days-hours-minutes': {
      const days = duration.days || 0
      const hours = duration.hours || 0
      const minutes = duration.minutes || 0
      return `${years}y ${months}M ${days}d ${hours}h ${minutes}m`
    }
    default:
      throw new Error(`Unknown unit: ${unitOfTime}`)
  }
}
