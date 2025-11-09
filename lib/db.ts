import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config();

import mongoose from "mongoose";

// Fetch MONGODB_URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
}

const connectdb = async () => {
    const connectionState = mongoose.connection.readyState;    
    // Check if the database is already connected or not

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    // console.log("MongoDB URI: ", MONGO_URI);

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "nextjsapi", // Database name
            bufferCommands: true // Buffer commands while the connection is being established
        });
        console.log("Connected to MongoDB");
    } catch (err : any) {
        console.error("Error connecting to MongoDB:", err);
        throw new Error(err);
    }
};

export default connectdb;
