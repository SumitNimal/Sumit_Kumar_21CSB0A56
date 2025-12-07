import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import offerRoutes from "./routes/offerRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", offerRoutes);
app.use("/api", discountRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
