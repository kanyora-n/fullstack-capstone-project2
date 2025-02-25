const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();
        // Task 2: Add the name filter
        const query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        // Task 3: Add other filters
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Task 4: Fetch filtered gifts
        const collection = db.collection('gifts');
        const filteredGifts = await collection.find(query).toArray();

        res.json(filteredGifts)

    } catch (error) {
        console.error('Error searching gifts:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
