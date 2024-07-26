import {
    IonButton,
    IonDatetime,
    IonDatetimeButton,
    IonIcon,
    IonImg,
    IonModal,
    IonPage,
    IonText,
} from '@ionic/react'
import { calculatorOutline } from 'ionicons/icons'
import './Home.css'
import { useState } from 'react'

const Home: React.FC = () => {
    const [showError, setShowError] = useState<boolean>(false)
    const [showResult, setShowResult] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')

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
        const startDate = new Date(start)
        const endDate = new Date(end)

        if (startDate > endDate) {
            setShowError(true)
            return
        }

        setShowError(false)

        const diff = endDate.getTime() - startDate.getTime()
        const hours = Math.floor(diff / 1000 / 60 / 60)
        const minutes = Math.floor((diff / 1000 / 60) % 60)

        setShowResult(true)
        setResult(`${hours}h ${minutes}m`)
    }

    const imageStyles = {
        width: '100%',
        maxWidth: '200px',
        marginTop: '1rem',
        pointerEvents: 'none',
    }

    return (
        <IonPage>
            <section className="home-container">
                <h1 className="header">Calculadora de Intervalo de Tempo</h1>

                {showError && (
                    <IonText color="danger">
                        O término não pode ser antes do início.
                    </IonText>
                )}

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

                                setShowResult(false)
                                setShowError(false)
                            }}
                        ></IonDatetime>
                    </IonModal>
                </div>

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
                                setShowResult(false)
                                setShowError(false)
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
                    <div className="result">
                        <h4 className="result-title">
                            O tempo entre os intervalos é:
                        </h4>
                        <span className="result-time">{result}</span>
                        <IonImg
                            src="https://linda.nyc3.cdn.digitaloceanspaces.com/370_npd_webp-o_06/sticker-fan_11257922_o.webp"
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
