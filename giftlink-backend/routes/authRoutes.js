//Step 1 - Task 2: Import necessary packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino'); // Import Pino logger

//Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const jwtSecret = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to 'giftsdb' in MongoDB through 'connectToDatabase' in db.js
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const usersCollection = db.collection('users');

        // Task 3: Check for existing email ID
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // Generate salt and hash password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Get email from request body
        const email = req.body.email;

        // Task 4: Save user details in the database
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: hash,
        };
        const result = await usersCollection.insertOne(newUser);

        // Task 5: Create JWT authentication with user._id as payload
        const authtoken = jwt.sign({ user: { id: result.insertedId.toString() } }, jwtSecret);

        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        logger.error('Registration error:', e);
        return res.status(500).send('Internal server error');
    }

        
});

module.exports = router;