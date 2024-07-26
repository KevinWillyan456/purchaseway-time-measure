import {
    IonButton,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonPage,
} from '@ionic/react'
import './Home.css'

const Home: React.FC = () => {
    return (
        <IonPage>
            <section className="home-container">
                <h1 className="header">Calculadora de Intervalo de Tempo</h1>

                <div className="form-group">
                    <p>Intervalo de início</p>

                    <div className="datetime-wrapper">
                        <IonDatetimeButton datetime="datetime-start"></IonDatetimeButton>
                    </div>

                    <IonModal keepContentsMounted={true}>
                        <IonDatetime id="datetime-start"></IonDatetime>
                    </IonModal>
                </div>

                <div className="form-group">
                    <p>Intervalo de término</p>

                    <div className="datetime-wrapper">
                        <IonDatetimeButton datetime="datetime-end"></IonDatetimeButton>
                    </div>

                    <IonModal keepContentsMounted={true}>
                        <IonDatetime id="datetime-end"></IonDatetime>
                    </IonModal>
                </div>

                <IonButton shape="round">Calcular</IonButton>

                <div className="result">O tempo entre os intervalos é: </div>
                <span id="resultado">1h</span>
            </section>
        </IonPage>
    )
}

export default Home
