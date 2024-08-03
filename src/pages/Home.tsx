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

type TypeUnitOfTime =
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'hours-minutes'
    | 'days'
    | 'days-hours'
    | 'days-hours-minutes'

const unitOfTimeOptions: { value: TypeUnitOfTime; label: string }[] = [
    { value: 'seconds', label: 'Segundos' },
    { value: 'minutes', label: 'Minutos' },
    { value: 'hours', label: 'Horas' },
    { value: 'hours-minutes', label: 'Horas e Minutos' },
    { value: 'days', label: 'Dias' },
    { value: 'days-hours', label: 'Dias e Horas' },
    { value: 'days-hours-minutes', label: 'Dias, Horas e Minutos' },
]

type TypeOfStartInterval = 'now' | 'custom'

const startIntervalOptions: { value: TypeOfStartInterval; label: string }[] = [
    { value: 'now', label: 'Agora' },
    { value: 'custom', label: 'Personalizado' },
]

const Home: React.FC = () => {
    const [showError, setShowError] = useState<boolean>(false)
    const [showResult, setShowResult] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [typeStartInterval, setTypeStartInterval] =
        useState<TypeOfStartInterval>('now')

    const [unitOfTime, setUnitOfTime] =
        useState<TypeUnitOfTime>('hours-minutes')

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

        if (unitOfTime === 'days') {
            const diff = endDate.getTime() - startDate.getTime()
            const days = Math.floor(diff / 1000 / 60 / 60 / 24)
            setResult(`${days}d`)

            setShowResult(true)
            return
        } else if (unitOfTime === 'hours') {
            const diff = endDate.getTime() - startDate.getTime()
            const hours = Math.floor(diff / 1000 / 60 / 60)
            setResult(`${hours}h`)

            setShowResult(true)
            return
        } else if (unitOfTime === 'minutes') {
            const diff = endDate.getTime() - startDate.getTime()
            const minutes = Math.floor(diff / 1000 / 60)
            setResult(`${minutes}m`)

            setShowResult(true)
            return
        } else if (unitOfTime === 'seconds') {
            const diff = endDate.getTime() - startDate.getTime()
            const seconds = Math.floor(diff / 1000)
            setResult(`${seconds}s`)

            setShowResult(true)
            return
        } else if (unitOfTime === 'hours-minutes') {
            const diff = endDate.getTime() - startDate.getTime()
            const hours = Math.floor(diff / 1000 / 60 / 60)
            const minutes = Math.floor((diff / 1000 / 60) % 60)
            setResult(`${hours}h ${minutes}m`)

            setShowResult(true)
        } else if (unitOfTime === 'days-hours') {
            const diff = endDate.getTime() - startDate.getTime()
            const days = Math.floor(diff / 1000 / 60 / 60 / 24)
            const hours = Math.floor((diff / 1000 / 60 / 60) % 24)
            setResult(`${days}d ${hours}h`)

            setShowResult(true)
        } else if (unitOfTime === 'days-hours-minutes') {
            const diff = endDate.getTime() - startDate.getTime()
            const days = Math.floor(diff / 1000 / 60 / 60 / 24)
            const hours = Math.floor((diff / 1000 / 60 / 60) % 24)
            const minutes = Math.floor((diff / 1000 / 60) % 60)
            setResult(`${days}d ${hours}h ${minutes}m`)

            setShowResult(true)
        }
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
