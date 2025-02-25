// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);      

    // Task 1: Connect to MongoDB
    await client.connect(); // Connect to MongoDB

    // Task 2: Connect to database giftdb and store in variable dbInstance
    dbInstance = client.db(dbName); // Connect to the "giftdb" database

     // Task 3: Return database instance
     return dbInstance; // Return the database instance
}

module.exports = connectToDatabase;
