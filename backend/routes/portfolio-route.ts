import express, { Request, Response } from 'express';
import Portfolio from '../models/portfolio-model';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const items = await Portfolio.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const newItem = new Portfolio(req.body);
        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;
