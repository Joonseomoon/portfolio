"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const portfolio_route_1 = __importDefault(require("./routes/portfolio-route"));
const experience_route_1 = __importDefault(require("./routes/experience-route"));
const skill_route_1 = __importDefault(require("./routes/skill-route"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/portfolio', portfolio_route_1.default);
app.use('/api/experience', experience_route_1.default);
app.use('/api/skills', skill_route_1.default);
const PORT = process.env.PORT ?? 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
