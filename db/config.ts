import mongoose from 'mongoose';
import { CONEXION_STRING } from '../global/environment';

const dbConnection = async () => {

    try {
        await mongoose.connect(CONEXION_STRING, { 
            useNewUrlParser: true, 
            useCreateIndex: true, 
            useUnifiedTopology: true, 
            useFindAndModify: false });
            

            console.log('Base de datos ONLINE');

    } catch (error) {        
        throw new Error('Error a la hora de inicializar la base de datos');
        
    }
}

export default dbConnection;
