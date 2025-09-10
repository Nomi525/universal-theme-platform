"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const design_1 = require("./routes/design");
const public_1 = require("./routes/public");
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "2mb" }));
app.use("/api/admin/design", design_1.router);
app.use("/api/products", products_1.default);
// FIX: leading slash
app.use("/api/categories", categories_1.default);
app.use("/api", public_1.router);
app.get("/health", (_req, res) => res.send("ok"));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
