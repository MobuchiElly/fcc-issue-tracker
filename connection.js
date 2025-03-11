require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
    const URI = process.env.MONGO_URI;
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        db = client.db("database");
        console.log('MongoDB connected successfully');

    } catch (e) {
        console.error(e);
        throw new Error('Unable to Connect to Database')
    }
}

async function getDB(retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        if (db) return db;
        console.log(`Database not connected. Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Database not connected after multiple attempts');
}

module.exports = { connectDB, getDB };