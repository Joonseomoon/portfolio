"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const portfolio_model_1 = __importDefault(require("../models/portfolio-model"));
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    try {
        const items = await portfolio_model_1.default.find();
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const newItem = new portfolio_model_1.default(req.body);
        const saved = await newItem.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
