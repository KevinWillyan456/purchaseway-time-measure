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
    IonText,
    useIonRouter,
} from '@ionic/react'
import { calculatorOutline, trashOutline } from 'ionicons/icons'
import './Home.css'
import { useState } from 'react'
import { App } from '@capacitor/app'
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    intervalToDuration,
} from 'date-fns'
import LocalStorageUtil from '../utils/LocalStorage'

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
    const [typeStartInterval, setTypeStartInterval] =
        useState<TypeOfStartInterval>(
            (LocalStorageUtil.getItem(
                'startIntervalType'
            ) as TypeOfStartInterval) ?? 'now'
        )

    const [unitOfTime, setUnitOfTime] = useState<TypeUnitOfTime>(
        (LocalStorageUtil.getItem('timeUnit') as TypeUnitOfTime) ?? 'seconds'
    )

    const getLocalISOTime = () => {
        const date = new Date()

        const pad = (num: number, size = 2) =>
            num.toString().padStart(size, '0')

        const year = date.getFullYear()
        const month = pad(date.getMonth() + 1)
        const day = pad(date.getDate())
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())
        const seconds = '00'
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
        const startDate =
            typeStartInterval === 'now'
                ? new Date(getLocalISOTime())
                : new Date(start)
        const endDate = new Date(end)

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
                const hoursForMinutes = Math.floor(
                    differenceInMinutes(endDate, startDate) / 60
                )
                const minutesForMinutes =
                    differenceInMinutes(endDate, startDate) % 60
                setResult(`${hoursForMinutes}h ${minutesForMinutes}m`)
                break
            case 'days-hours':
                const daysForHours = Math.floor(
                    differenceInHours(endDate, startDate) / 24
                )
                const remainingHoursForHours =
                    differenceInHours(endDate, startDate) % 24
                setResult(`${daysForHours}d ${remainingHoursForHours}h`)
                break
            case 'days-hours-minutes':
                const totalDaysForMinutes = Math.floor(
                    differenceInMinutes(endDate, startDate) / (24 * 60)
                )
                const hoursWithinDayForMinutes = Math.floor(
                    (differenceInMinutes(endDate, startDate) % (24 * 60)) / 60
                )
                const minutesWithinHourForMinutes =
                    differenceInMinutes(endDate, startDate) % 60
                setResult(
                    `${totalDaysForMinutes}d ${hoursWithinDayForMinutes}h ${minutesWithinHourForMinutes}m`
                )
                break
            case 'weeks':
                const weeks = Math.floor(
                    differenceInDays(endDate, startDate) / 7
                )
                setResult(`${weeks}w`)
                break
            case 'weeks-days':
                const totalWeeks = Math.floor(
                    differenceInDays(endDate, startDate) / 7
                )
                const daysWithinWeek = differenceInDays(endDate, startDate) % 7
                setResult(`${totalWeeks}w ${daysWithinWeek}d`)
                break
            case 'weeks-days-hours':
                const weeksForDays = Math.floor(
                    differenceInHours(endDate, startDate) / (7 * 24)
                )
                const daysWithinWeekForHours = Math.floor(
                    (differenceInHours(endDate, startDate) % (7 * 24)) / 24
                )
                const hoursWithinWeekForHours =
                    differenceInHours(endDate, startDate) % 24
                setResult(
                    `${weeksForDays}w ${daysWithinWeekForHours}d ${hoursWithinWeekForHours}h`
                )
                break
            case 'weeks-days-hours-minutes':
                const weeksForMinutes = Math.floor(
                    differenceInMinutes(endDate, startDate) / (7 * 24 * 60)
                )
                const daysWithinWeekForMinutes = Math.floor(
                    (differenceInMinutes(endDate, startDate) % (7 * 24 * 60)) /
                        (24 * 60)
                )
                const hoursWithinWeekForMinutes = Math.floor(
                    (differenceInMinutes(endDate, startDate) % (24 * 60)) / 60
                )
                const minutesWithinWeekForMinutes =
                    differenceInMinutes(endDate, startDate) % 60
                setResult(
                    `${weeksForMinutes}w ${daysWithinWeekForMinutes}d ${hoursWithinWeekForMinutes}h ${minutesWithinWeekForMinutes}m`
                )
                break
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

        setShowResult(true)
    }

    const imageStyles = {
        width: '100%',
        maxWidth: '200px',
        marginTop: '1rem',
        pointerEvents: 'none',
    }

    const hiddenComponents = () => {
        setShowResult(false)
        setShowError(false)
    }

    const ionRouter = useIonRouter()
    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
            if (!ionRouter.canGoBack()) {
                App.exitApp()
            }
        })
    })

    return (
        <IonPage>
            <section className="home-container">
                <h1 className="header">Calculadora de Intervalo de Tempo</h1>

                <p style={{ marginBottom: '1.5rem' }}>
                    Selecione o intervalo de tempo para calcular a diferença.
                </p>

                <p>Escolha a unidade de tempo:</p>

                <IonList>
                    <IonItem>
                        <IonSelect
                            aria-label="Unidade de tempo"
                            value={unitOfTime}
                            interface="popover"
                            placeholder="Selecione a unidade"
                            onIonChange={(e) => {
                                setUnitOfTime(e.detail.value as TypeUnitOfTime)
                                LocalStorageUtil.setItem(
                                    'timeUnit',
                                    e.detail.value
                                )
                                hiddenComponents()
                            }}
                        >
                            {unitOfTimeOptions.map((option) => (
                                <IonSelectOption
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                </IonList>

                <p>Escolha o tipo de intervalo de início:</p>

                <IonList style={{ marginBottom: '1rem' }}>
                    <IonItem>
                        <IonSelect
                            aria-label="Tipo de intervalo"
                            value={typeStartInterval}
                            interface="popover"
                            placeholder="Selecione o tipo de intervalo"
                            onIonChange={(e) => {
                                setTypeStartInterval(
                                    e.detail.value as TypeOfStartInterval
                                )
                                LocalStorageUtil.setItem(
                                    'startIntervalType',
                                    e.detail.value
                                )
                                hiddenComponents()
                            }}
                        >
                            {startIntervalOptions.map((option) => (
                                <IonSelectOption
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                </IonList>

                {typeStartInterval === 'custom' && (
                    <div className="form-group">
                        <p>Intervalo de início</p>

                        <div className="datetime-wrapper">
                            <IonDatetimeButton datetime="datetime-start"></IonDatetimeButton>
                        </div>

                        <IonModal keepContentsMounted={true}>
                            <IonDatetime
                                id="datetime-start"
                                locale="pt-BR"
                                value={start}
                                max={new Date(
                                    new Date().setFullYear(
                                        new Date().getFullYear() +
                                            MAX_YEARS_AHEAD_OF_TODAY
                                    )
                                )
                                    .toISOString()
                                    .split('-')[0]
                                    .concat('-12-31T23:59:00.000Z')}
                                onIonChange={(e) => {
                                    setStart(
                                        Array.isArray(e.detail.value)
                                            ? e.detail.value.join('')
                                            : e.detail.value ?? ''
                                    )

                                    hiddenComponents()
                                }}
                            ></IonDatetime>
                        </IonModal>
                    </div>
                )}

                <div className="form-group">
                    <p>Intervalo de término</p>

                    <div className="datetime-wrapper">
                        <IonDatetimeButton datetime="datetime-end"></IonDatetimeButton>
                    </div>

                    <IonModal keepContentsMounted={true}>
                        <IonDatetime
                            id="datetime-end"
                            locale="pt-BR"
                            value={end}
                            max={new Date(
                                new Date().setFullYear(
                                    new Date().getFullYear() +
                                        MAX_YEARS_AHEAD_OF_TODAY
                                )
                            )
                                .toISOString()
                                .split('-')[0]
                                .concat('-12-31T23:59:00.000Z')}
                            onIonChange={(e) => {
                                setEnd(
                                    Array.isArray(e.detail.value)
                                        ? e.detail.value.join('')
                                        : e.detail.value ?? ''
                                )

                                hiddenComponents()
                            }}
                        ></IonDatetime>
                    </IonModal>
                </div>

                <IonButton
                    shape="round"
                    disabled={showError ? true : false}
                    onClick={handleCalculate}
                    style={{
                        marginTop: '0.5rem',
                    }}
                >
                    <IonIcon
                        icon={calculatorOutline}
                        style={{
                            marginRight: '0.3rem',
                        }}
                    ></IonIcon>
                    Calcular
                </IonButton>

                {showResult && (
                    <IonButton
                        shape="round"
                        fill="outline"
                        onClick={() => setShowResult(false)}
                        style={{
                            marginTop: '0.5rem',
                            marginLeft: '0.5rem',
                            animation: 'fadeIn 500ms',
                        }}
                    >
                        <IonIcon
                            icon={trashOutline}
                            style={{
                                marginRight: '0.3rem',
                            }}
                        ></IonIcon>
                        Limpar
                    </IonButton>
                )}

                {showError && (
                    <IonText color="danger">
                        <p
                            style={{ marginTop: '1rem' }}
                            className="error-message"
                        >
                            O término não pode ser antes do início.
                        </p>
                    </IonText>
                )}

                {showResult && (
                    <div className="result">
                        <h4 className="result-title">
                            O tempo entre os intervalos é:
                        </h4>
                        <span className="result-time">{result}</span>
                        <IonImg
                            src="assets/logo.png"
                            alt="Sticker decorativo"
                            style={imageStyles}
                        />
                    </div>
                )}
            </section>
        </IonPage>
    )
}

export default Home
