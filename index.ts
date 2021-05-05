import Server from "./classes/server";
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/router';
import dbConnection from './db/config';

const server = Server.instance;

//BodyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//CORS
server.app.use( cors({origin: true, credentials: true}) );

//Rutas de servicios
server.app.use('/api', router);

//Conectar DB
dbConnection();

server.start( () =>{
    console.log(`Servidor corriendo en el puerto ${ server.port }`); 
});