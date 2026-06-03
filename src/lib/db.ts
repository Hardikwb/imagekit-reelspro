import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

let cached = global.mongoose;

if(!cached){
    cached=global.mongoose =    { connection:null,promise:null }
}

export async function connectToDB(){
    if(cached.connection){
        return cached.connection
    }
    if(!cached.promise){
        const opts={
            bufferCommands:true,
            maxPool:10
        };
        
        cached.promise = mongoose.connect(MONGODB_URI,opts)
           .then(()=>mongoose.connection)
    }
        
    try {
        const connection = await cached.promise;    
    } 
    catch (error) {
        cached.promise = null
        throw error;
    }
    finally{
        return cached.connection;
    }
}