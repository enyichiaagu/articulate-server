import { Router } from "express";

const articlesRouter = Router();

articlesRouter.get("/:id", (req, res) => {
	const docId = req.params.id;
	if (!docId) {
		res.status(400).json({ error: "Document does not have a valid id" });
		return;
	}
});

export default articlesRouter;
