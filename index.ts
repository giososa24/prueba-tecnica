import Server from "./classes/server";
import bodyParser from 'body-parser';
import cors from 'cors';
import loginRoutes from './routes/login';
import dbConnection from './db/config';
import usuarioRoutes from "./routes/usuario";
import tareaRoutes from "./routes/tarea";

const server = Server.instance;

//BodyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//CORS
server.app.use( cors({origin: true, credentials: true}) );

//Rutas de servicios
server.app.use('/api/login', loginRoutes);
server.app.use('/api/usuario', usuarioRoutes);
server.app.use('/api/tarea', tareaRoutes);

//Conectar DB
dbConnection();

server.start( () =>{
    console.log(`Servidor corriendo en el puerto ${ server.port }`); 
});