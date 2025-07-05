import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", (req, res) => {
	res.json({ data: "active" });
});

export default pingRouter;
