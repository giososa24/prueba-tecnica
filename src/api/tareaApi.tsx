import axios from 'axios';


//Dentro de este archivo se configura axios para realizar peticiones al backend

const baseURL = 'http://localhost:3200/api';
//const baseURL = 'https://prueba-arkon.herokuapp.com';

const tareaApi = axios.create({ baseURL });

tareaApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if ( token ) {
            config.headers['Authorization'] = token; //Se agrega la cabecera de autenticacion que llevara el token el cual tiene un tiempo de expiracion de 5 días
        }
        return config;
    }
);



export default tareaApi;