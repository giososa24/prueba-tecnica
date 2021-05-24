
//Esta funcion sirve para colocar el tiempo que llega del backend con un formato 00:00:00

export const tiempo = (tiempo: number) => {
    if(tiempo < 10){
        return `0${tiempo}`;
    } else {
        return tiempo.toString();
    }
}


