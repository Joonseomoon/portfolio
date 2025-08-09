import express from 'express';
import Skill from '../models/skill-model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const exp = await Skill.find();
        res.json(exp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newExp = new Skill(req.body);
        const saved = await newExp.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
