import moment from 'moment';
import Tarea from "../interfaces/tarea";
import { tiempo } from './formatoTiempo';
import 'moment/locale/es-mx';


export const prepareDataTask = (tareas: Tarea[]) => {
    tareas.forEach((item) => {
        if(item.terminado){
            //item.terminadoString = moment(item.terminado).startOf('second').fromNow();
            item.terminadoString = moment(item.terminado).format('lll');
        } else {
            item.terminadoString = '';
        }
        if(item.iniciado) {
            //item.iniciadoString = moment(item.iniciado).startOf('second').fromNow();
            item.iniciadoString = moment(item.iniciado).format('lll');
        } else {
            item.iniciadoString = '';
        }
        item.duracion = `${tiempo(item.horas)}:${tiempo(item.minutos)}:${tiempo(item.segundos)}`;
        item.tiempo = `${tiempo(item.tiempoHoras!)}:${tiempo(item.tiempoMinutos!)}:${tiempo(item.tiempoSegundos!)}`;
        if (item.estado === 1) {
            item.estadoString = 'Por iniciar'
        }
        if (item.estado === 0) {
            item.estadoString = 'En curso';
        }
        if (item.estado === 2) {
            item.estadoString = 'Pausado';
        }
        if (item.estado === 3) {
            item.estadoString = 'Finalizado';
        }
    });

    return tareas;
}