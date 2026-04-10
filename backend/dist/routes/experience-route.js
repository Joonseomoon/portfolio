"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experience_model_1 = __importDefault(require("../models/experience-model"));
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    try {
        const exp = await experience_model_1.default.find();
        res.json(exp);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const newExp = new experience_model_1.default(req.body);
        const saved = await newExp.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
