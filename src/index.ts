import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import translationsRouter from "./routes/translations.router";
import pingRouter from "./routes/ping.router";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/ping", pingRouter);
app.use("/translations", translationsRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
