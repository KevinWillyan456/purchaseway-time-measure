import { App } from '@capacitor/app'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonImg,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  useIonRouter,
  useIonToast,
} from '@ionic/react'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  intervalToDuration,
} from 'date-fns'

import {
  calculatorOutline,
  calendarOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  copyOutline,
  hourglassOutline,
  moonOutline,
  sunnyOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons'
import { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../App'
import LocalStorageUtil from '../utils/LocalStorage'
import './Home.css'

type TypeUnitOfTime =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'hours-minutes'
  | 'days'
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

const unitOfTimeOptions: { value: TypeUnitOfTime; label: string }[] = [
  { value: 'seconds', label: 'Segundos' },
  { value: 'minutes', label: 'Minutos' },
  { value: 'hours', label: 'Horas' },
  { value: 'hours-minutes', label: 'Horas e Minutos' },
  { value: 'days', label: 'Dias' },
  { value: 'days-hours', label: 'Dias e Horas' },
  { value: 'days-hours-minutes', label: 'Dias, Horas e Minutos' },
  { value: 'weeks', label: 'Semanas' },
  { value: 'weeks-days', label: 'Semanas e Dias' },
  { value: 'weeks-days-hours', label: 'Semanas, Dias e Horas' },
  {
    value: 'weeks-days-hours-minutes',
    label: 'Semanas, Dias, Horas e Minutos',
  },
  { value: 'months', label: 'Meses' },
  { value: 'months-days', label: 'Meses e Dias' },
  { value: 'months-days-hours', label: 'Meses, Dias e Horas' },
  {
    value: 'months-days-hours-minutes',
    label: 'Meses, Dias, Horas e Minutos',
  },
  { value: 'years', label: 'Anos' },
  { value: 'years-months', label: 'Anos e Meses' },
  { value: 'years-months-days', label: 'Anos, Meses e Dias' },
  { value: 'years-months-days-hours', label: 'Anos, Meses, Dias e Horas' },
  {
    value: 'years-months-days-hours-minutes',
    label: 'Anos, Meses, Dias, Horas e Minutos',
  },
]

type TypeOfStartInterval = 'now' | 'custom'

const startIntervalOptions: { value: TypeOfStartInterval; label: string }[] = [
  { value: 'now', label: 'Agora' },
  { value: 'custom', label: 'Personalizado' },
]

const MAX_YEARS_AHEAD_OF_TODAY = 100

const Home: React.FC = () => {
  const [showError, setShowError] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [alternatives, setAlternatives] = useState<{ label: string; value: string }[]>([])
  const resultRef = useRef<HTMLDivElement>(null)
  const [present] = useIonToast()
  const { cycleMode, icon: themeIcon, label: themeLabel } = useContext(ThemeContext)

  // Detectar mobile para usar action-sheet (reativo a resize)
  const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768
  const [isMobile, setIsMobile] = useState(getIsMobile)

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Action-sheet só para poucas opções; popover para muitas
  const getSelectInterface = (optionCount: number) => {
    if (!isMobile) return 'popover'
    return optionCount <= 5 ? 'action-sheet' : 'popover'
  }
  const [typeStartInterval, setTypeStartInterval] = useState<TypeOfStartInterval>(
    (LocalStorageUtil.getItem('startIntervalType') as TypeOfStartInterval) ?? 'now',
  )

  const [unitOfTime, setUnitOfTime] = useState<TypeUnitOfTime>(
    (LocalStorageUtil.getItem('timeUnit') as TypeUnitOfTime) ?? 'seconds',
  )

  const getLocalISOTime = () => {
    const date = new Date()

    const pad = (num: number, size = 2) => num.toString().padStart(size, '0')

    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())
    const milliseconds = '000'

    const timezoneOffset = -date.getTimezoneOffset()
    const sign = timezoneOffset >= 0 ? '+' : '-'
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60))
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60)

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`
  }

  const [start, setStart] = useState<string>(getLocalISOTime())
  const [end, setEnd] = useState<string>(getLocalISOTime())

  const handleCalculate = () => {
    Haptics.impact({ style: ImpactStyle.Medium })

    const now = getLocalISOTime()
    const startDate = typeStartInterval === 'now' ? new Date(now) : new Date(start)
    const endDate = typeStartInterval === 'now' ? new Date(now) : new Date(end)

    if (startDate > endDate) {
      setShowError(true)
      setShowResult(false)
      return
    }

    setShowError(false)

    const duration = intervalToDuration({ start: startDate, end: endDate })

    const years = duration.years || 0
    const months = duration.months || 0
    const days = duration.days || 0
    const hours = duration.hours || 0
    const minutes = duration.minutes || 0

    switch (unitOfTime) {
      case 'days':
        const totalDays = differenceInDays(endDate, startDate)
        setResult(`${totalDays}d`)
        break
      case 'hours':
        const totalHours = differenceInHours(endDate, startDate)
        setResult(`${totalHours}h`)
        break
      case 'minutes':
        const totalMinutes = differenceInMinutes(endDate, startDate)
        setResult(`${totalMinutes}m`)
        break
      case 'seconds':
        const totalSeconds = differenceInSeconds(endDate, startDate)
        setResult(`${totalSeconds}s`)
        break
      case 'hours-minutes':
        const hoursForMinutes = Math.floor(differenceInMinutes(endDate, startDate) / 60)
        const minutesForMinutes = differenceInMinutes(endDate, startDate) % 60
        setResult(`${hoursForMinutes}h ${minutesForMinutes}m`)
        break
      case 'days-hours':
        const daysForHours = Math.floor(differenceInHours(endDate, startDate) / 24)
        const remainingHoursForHours = differenceInHours(endDate, startDate) % 24
        setResult(`${daysForHours}d ${remainingHoursForHours}h`)
        break
      case 'days-hours-minutes': {
        const totalMins = differenceInMinutes(endDate, startDate)
        const d = Math.floor(totalMins / (24 * 60))
        const h = Math.floor((totalMins % (24 * 60)) / 60)
        const m = totalMins % 60
        setResult(`${d}d ${h}h ${m}m`)
        break
      }
      case 'weeks':
        const weeks = Math.floor(differenceInDays(endDate, startDate) / 7)
        setResult(`${weeks}w`)
        break
      case 'weeks-days':
        const totalWeeks = Math.floor(differenceInDays(endDate, startDate) / 7)
        const daysWithinWeek = differenceInDays(endDate, startDate) % 7
        setResult(`${totalWeeks}w ${daysWithinWeek}d`)
        break
      case 'weeks-days-hours':
        const weeksForDays = Math.floor(differenceInHours(endDate, startDate) / (7 * 24))
        const daysWithinWeekForHours = Math.floor(
          (differenceInHours(endDate, startDate) % (7 * 24)) / 24,
        )
        const hoursWithinWeekForHours = differenceInHours(endDate, startDate) % 24
        setResult(`${weeksForDays}w ${daysWithinWeekForHours}d ${hoursWithinWeekForHours}h`)
        break
      case 'weeks-days-hours-minutes': {
        const totalMins = differenceInMinutes(endDate, startDate)
        const w = Math.floor(totalMins / (7 * 24 * 60))
        const wd = Math.floor((totalMins % (7 * 24 * 60)) / (24 * 60))
        const wh = Math.floor((totalMins % (24 * 60)) / 60)
        const wm = totalMins % 60
        setResult(`${w}w ${wd}d ${wh}h ${wm}m`)
        break
      }
      case 'months':
        setResult(`${months}M`)
        break
      case 'months-days':
        setResult(`${months}M ${days}d`)
        break
      case 'months-days-hours':
        setResult(`${months}M ${days}d ${hours}h`)
        break
      case 'months-days-hours-minutes':
        setResult(`${months}M ${days}d ${hours}h ${minutes}m`)
        break
      case 'years':
        setResult(`${years}y`)
        break
      case 'years-months':
        setResult(`${years}y ${months}M`)
        break
      case 'years-months-days':
        setResult(`${years}y ${months}M ${days}d`)
        break
      case 'years-months-days-hours':
        setResult(`${years}y ${months}M ${days}d ${hours}h`)
        break
      case 'years-months-days-hours-minutes':
        setResult(`${years}y ${months}M ${days}d ${hours}h ${minutes}m`)
        break
      default:
        setShowResult(false)
        return
    }

    // Calcular equivalências em outras unidades
    const totalSec = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
    const totalMin = Math.floor(totalSec / 60)
    const totalHrs = Math.floor(totalMin / 60)
    const totalDays = Math.floor(totalHrs / 24)
    const totalWeeks = Math.floor(totalDays / 7)
    // Usar intervalToDuration para meses e anos (calendário real)
    const totalMonthsCal = (duration.years || 0) * 12 + (duration.months || 0)
    const totalYearsCal = duration.years || 0

    const formatNum = (n: number) => n.toLocaleString('pt-BR')

    const allAlts: { label: string; value: string; key: string }[] = [
      {
        key: 'seconds',
        label: 'Segundos',
        value: `${formatNum(totalSec)}s`,
      },
      {
        key: 'minutes',
        label: 'Minutos',
        value: `${formatNum(totalMin)}m`,
      },
      { key: 'hours', label: 'Horas', value: `${formatNum(totalHrs)}h` },
      { key: 'days', label: 'Dias', value: `${formatNum(totalDays)}d` },
      {
        key: 'weeks',
        label: 'Semanas',
        value: `${formatNum(totalWeeks)}sem`,
      },
      {
        key: 'months',
        label: 'Meses (calendário)',
        value: `${formatNum(totalMonthsCal)}M`,
      },
      {
        key: 'years',
        label: 'Anos (calendário)',
        value: `${formatNum(totalYearsCal)}a`,
      },
    ]

    // Determinar qual chave está selecionada para excluir
    const selectedKey = unitOfTime.split('-')[0]
    const filteredAlts = allAlts
      .filter((a) => a.key !== selectedKey)
      .map(({ label, value }) => ({ label, value }))

    setAlternatives(filteredAlts)
    setShowResult(true)

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 100)
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      Haptics.impact({ style: ImpactStyle.Light })
      present({
        message: `${value} copiado!`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
        icon: copyOutline,
      })
    } catch {
      present({
        message: 'Erro ao copiar',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      })
    }
  }

  const hiddenComponents = () => {
    setShowResult(false)
    setShowError(false)
  }

  const ionRouter = useIonRouter()

  useEffect(() => {
    const handler = (ev: any) => {
      ev.detail.register(-1, () => {
        if (!ionRouter.canGoBack()) {
          App.exitApp()
        }
      })
    }
    document.addEventListener('ionBackButton', handler)
    return () => document.removeEventListener('ionBackButton', handler)
  }, [ionRouter])

  return (
    <IonPage>
      <section className="home-container">
        {/* ===== HEADER ===== */}
        <div className="header">
          <h1 className="header-title">
            <IonIcon icon={calculatorOutline} className="header-icon" />
            Calculadora de Intervalo de Tempo
          </h1>
          <button
            className="theme-toggle"
            onClick={cycleMode}
            title={`Tema: ${themeLabel}`}
            aria-label="Alternar tema"
          >
            <IonIcon icon={themeIcon === 'sunny' ? sunnyOutline : moonOutline} />
          </button>
        </div>

        <p className="subtitle">Selecione o intervalo de tempo para calcular a diferença.</p>

        {/* ===== CARD: UNIDADE DE TEMPO ===== */}
        <div className="form-card">
          <div className="form-card-label">
            <IonIcon icon={hourglassOutline} />
            Unidade de Tempo
          </div>
          <IonList>
            <IonItem>
              <IonSelect
                aria-label="Unidade de tempo"
                value={unitOfTime}
                interface={getSelectInterface(unitOfTimeOptions.length)}
                placeholder="Selecione a unidade"
                cancelText="Cancelar"
                onIonChange={(e) => {
                  setUnitOfTime(e.detail.value as TypeUnitOfTime)
                  LocalStorageUtil.setItem('timeUnit', e.detail.value)
                  hiddenComponents()
                }}
              >
                {unitOfTimeOptions.map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </div>

        {/* ===== CARD: TIPO DE INTERVALO ===== */}
        <div className="form-card">
          <div className="form-card-label">
            <IonIcon icon={timeOutline} />
            Tipo de Intervalo
          </div>
          <IonList>
            <IonItem>
              <IonSelect
                aria-label="Tipo de intervalo"
                value={typeStartInterval}
                interface={getSelectInterface(startIntervalOptions.length)}
                placeholder="Selecione o tipo de intervalo"
                cancelText="Cancelar"
                onIonChange={(e) => {
                  setTypeStartInterval(e.detail.value as TypeOfStartInterval)
                  LocalStorageUtil.setItem('startIntervalType', e.detail.value)
                  hiddenComponents()
                }}
              >
                {startIntervalOptions.map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </div>

        {/* ===== CARD: DATA DE INICIO ===== */}
        {typeStartInterval === 'custom' && (
          <div className="form-card">
            <div className="form-card-label">
              <IonIcon icon={calendarOutline} />
              Data de Início
            </div>
            <div className="datetime-wrapper">
              <IonDatetimeButton datetime="datetime-start" />
            </div>

            <IonModal keepContentsMounted={true}>
              <IonDatetime
                id="datetime-start"
                locale="pt-BR"
                value={start}
                max={new Date(
                  new Date().setFullYear(new Date().getFullYear() + MAX_YEARS_AHEAD_OF_TODAY),
                )
                  .toISOString()
                  .split('-')[0]
                  .concat('-12-31T23:59:00.000Z')}
                onIonChange={(e) => {
                  setStart(
                    Array.isArray(e.detail.value)
                      ? e.detail.value.join('')
                      : (e.detail.value ?? ''),
                  )
                  hiddenComponents()
                }}
              />
            </IonModal>
          </div>
        )}

        {/* ===== CARD: DATA DE TERMINO ===== */}
        <div className="form-card">
          <div className="form-card-label">
            <IonIcon icon={calendarOutline} />
            Data de Término
          </div>
          <div className="datetime-wrapper">
            <IonDatetimeButton datetime="datetime-end" />
          </div>

          <IonModal keepContentsMounted={true}>
            <IonDatetime
              id="datetime-end"
              locale="pt-BR"
              value={end}
              max={new Date(
                new Date().setFullYear(new Date().getFullYear() + MAX_YEARS_AHEAD_OF_TODAY),
              )
                .toISOString()
                .split('-')[0]
                .concat('-12-31T23:59:00.000Z')}
              onIonChange={(e) => {
                setEnd(
                  Array.isArray(e.detail.value) ? e.detail.value.join('') : (e.detail.value ?? ''),
                )
                hiddenComponents()
              }}
            />
          </IonModal>
        </div>

        {/* ===== BOTÃO CALCULAR ===== */}
        <button
          className="calculate-btn"
          disabled={
            showError || (typeStartInterval === 'custom' && new Date(start) > new Date(end))
          }
          onClick={handleCalculate}
        >
          <IonIcon icon={calculatorOutline} />
          Calcular
        </button>

        {/* ===== ERRO ===== */}
        {showError && (
          <div className="error-card">
            <IonIcon icon={closeCircleOutline} />
            <p>O término não pode ser antes do início.</p>
          </div>
        )}

        {/* ===== BOTÃO LIMPAR ===== */}
        {showResult && (
          <IonButton className="clear-btn-full" fill="outline" onClick={() => setShowResult(false)}>
            <IonIcon icon={trashOutline} />
            Limpar Resultado
          </IonButton>
        )}

        {/* ===== RESULTADO ===== */}
        {showResult && (
          <div className="result-card" ref={resultRef}>
            <IonIcon icon={checkmarkCircleOutline} className="result-icon" />
            <p className="result-label">O tempo entre os intervalos é:</p>
            <div className="result-divider" />
            <span
              className="result-time result-time-clickable"
              onClick={() => handleCopy(result)}
              title="Toque para copiar"
            >
              {result}
            </span>
            <p className="copy-hint">Toque no resultado para copiar</p>
            <IonImg src="assets/logo.png" alt="Sticker decorativo" className="result-img" />
            {alternatives.length > 0 && (
              <div className="alternatives-section">
                <p className="alternatives-title">Equivalente em outras unidades:</p>
                <div className="alternatives-grid">
                  {alternatives.map((alt) => (
                    <div
                      className="alternative-chip alternative-chip-clickable"
                      key={alt.label}
                      onClick={() => handleCopy(alt.value)}
                      title="Toque para copiar"
                    >
                      <span className="alternative-label">{alt.label}</span>
                      <span className="alternative-value">{alt.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="result-footer">© {new Date().getFullYear()} PurchaseWay</p>
          </div>
        )}
      </section>
    </IonPage>
  )
}

export default Home
