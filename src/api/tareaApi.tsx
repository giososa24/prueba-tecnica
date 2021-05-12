import axios from 'axios';

const baseURL = 'http://localhost:3200/api';

const tareaApi = axios.create({ baseURL });

tareaApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if ( token ) {
            config.headers['Authorization'] = token;
        }
        return config;
    }
);



export default tareaApi;