import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as designRouter } from "./routes/design";
import { router as publicRouter } from "./routes/public";
import productsRoute from "./routes/products";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/admin/design", designRouter);
app.use("/api/products", productsRoute);
app.use("/api", publicRouter);
// quick ping
app.get("/health", (_req, res) => res.send("ok"));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
