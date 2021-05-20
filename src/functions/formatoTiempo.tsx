
export const tiempo = (tiempo: number) => {
    if(tiempo < 10){
        return `0${tiempo}`;
    } else {
        return tiempo.toString();
    }
}


