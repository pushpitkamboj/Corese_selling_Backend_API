import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URL!;

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Test MongoDB connection state
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});
