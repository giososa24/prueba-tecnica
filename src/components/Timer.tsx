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

const Timer = ({ currentTask, loadData, finishTask, pause }: Props) => {

    const [totalTime, setTotalTime] = useState(0);
    const { changeState } = useTask();
    const elapsedTime = useRef(0);
    const [pauseTimer, setPauseTimer] = useState(false);

    useEffect(() => {
        initialTime();
    }, [currentTask.estado]);

    useEffect(() => {
        if(finishTask) {
            onChangeStatus(elapsedTime.current);
        }
    }, [finishTask]);

    useEffect(() => {
        setPauseTimer(pause);
    }, [pause]);

    const minuteSeconds = 60;
    const hourSeconds = 3600;

    const timerProps = {
        isPlaying: pauseTimer,
        size: 120,
        strokeWidth: 6
    };

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

    const renderTime = (dimension: string, time: number, remainingTime: number, elapsed: number) => {
        elapsedTime.current = elapsed;        
        return (
            <div className="time-wrapper">
                <div className="time">{time}</div>
                <div>{dimension}</div>
            </div>
        );
    };

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
