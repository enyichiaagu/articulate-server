import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import pingRouter from "./routes/ping.router.js";
import translationsRouter from "./routes/translations.router.js";
import articlesRouter from "./routes/articles.router.js";
import docsRouter from "./routes/docs.router.js";
import autumnRouter from "./routes/autumn.router.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/", docsRouter);
app.use("/ping", pingRouter);
app.use("/translations", translationsRouter);
app.use("/docs", articlesRouter);
app.use("/api/autumn", autumnRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
