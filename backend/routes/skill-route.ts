import express, { Request, Response } from 'express';
import Skill from '../models/skill-model';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const newSkill = new Skill(req.body);
        const saved = await newSkill.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
