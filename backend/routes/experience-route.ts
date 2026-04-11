import express, { Request, Response } from 'express';
import Experience from '../models/experience-model';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const exp = await Experience.find().sort({ startDate: -1 });
        res.json(exp);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const newExp = new Experience(req.body);
        const saved = await newExp.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
