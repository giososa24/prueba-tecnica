import { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Tarea from "../interfaces/tarea";
import "../App.css";
import { useTask } from "../hooks/useTask";

interface Props {
    currentTask: Tarea;
    loadData: () => void;
    finishTask: boolean;
    pause: boolean;
}

//Este componente funciona para mostrar el temporizador de la tarea en curso
const Timer = ({ currentTask, loadData, finishTask, pause }: Props) => {

    //Hook utilizados para manejar el estado del temporizador
    const [totalTime, setTotalTime] = useState(0);
    const { changeState } = useTask();
    const elapsedTime = useRef(0);
    const [pauseTimer, setPauseTimer] = useState(false);
    const minuteSeconds = 60;
    const hourSeconds = 3600;

    const timerProps = {
        isPlaying: pauseTimer,
        size: 120,
        strokeWidth: 6
    };

    //Se inicia el temporizador
    useEffect(() => {
        initialTime();
    }, [currentTask.estado]);

    //Con esta funcion se finaliza una tarea pasando el tiempo transcurrido
    useEffect(() => {
        if(finishTask) {
            onChangeStatus(elapsedTime.current);
        }
    }, [finishTask]);

    //Con este hook se pausa el temporizador
    useEffect(() => {
        setPauseTimer(pause);
    }, [pause]);

    //Se establece el tiempo inicial de la tarea en curso en minutos
    const initialTime = () => {

        const { horas, minutos, segundos } = currentTask;

        let totalTime2: number = 0;

        if (horas === 0) {
            totalTime2 = minutos + (segundos / minuteSeconds);
        }
        if (horas === 1) {
            totalTime2 = minutos + 60 + (segundos / minuteSeconds);
        }
        if (horas === 2) {
            totalTime2 = 120;
        }

        setTotalTime(totalTime2 * 60);
    }

    const getTimeMinutes = (time: number) => ((time % hourSeconds) / minuteSeconds) | 0;

    //Se renderiza el temporizador
    const renderTime = (dimension: string, time: number, remainingTime: number, elapsed: number) => {
        elapsedTime.current = elapsed;        
        return (
            <div className="time-wrapper">
                <div className="time">{time}</div>
                <div>{dimension}</div>
            </div>
        );
    };

    //Funcion para guardar el tiempo de una tarea finalizada
    const onChangeStatus = (elapsed: number) => {
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        currentTask.estado = 3;
        currentTask.tiempoHoras = Math.floor(hours);
        currentTask.tiempoMinutos = Math.floor(minutes);
        currentTask.tiempoSegundos = Math.floor(seconds);

        changeState(currentTask).then(() => {
            loadData();
        });
    }

    return (
        <div className="App">
            {totalTime > 0 && <CountdownCircleTimer
                {...timerProps}
                colors={"#EF798A"}
                duration={totalTime}
                initialRemainingTime={totalTime}
                onComplete={(totalElapsedTime) => onChangeStatus(totalElapsedTime)}
            >
                {({ elapsedTime, remainingTime }) =>
                    renderTime("minutos", getTimeMinutes(totalTime - elapsedTime!), remainingTime!, elapsedTime!)
                }
            </CountdownCircleTimer>}
        </div>
    )
}

export default Timer;
