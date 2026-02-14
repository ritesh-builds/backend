import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { exit } from 'node:process';

const connectDB = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n✅ MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log('ERROR: MONGODB connection error',error)
        process.exit(1)        // It's a feature of nodejs. 
    }
}

export default connectDB;