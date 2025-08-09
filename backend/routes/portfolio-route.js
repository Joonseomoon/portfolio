import express from 'express';
import Portfolio from '../models/portfolio-model.js';

const router = express.Router();

// GET all portfolio items
router.get('/', async (req, res) => {
    try {
        const items = await Portfolio.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (Optional) POST to seed via Postman
router.post('/', async (req, res) => {
    try {
        const newItem = new Portfolio(req.body);
        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
