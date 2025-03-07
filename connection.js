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

function getDB() {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db;
}

module.exports = { connectDB, getDB };