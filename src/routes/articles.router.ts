import { Router } from "express";
import supabase from "../services/supabase.services";

const articlesRouter = Router();

articlesRouter.get("/:docId/:language", async (req, res) => {
	const { docId, language } = req.params;

	if (!docId || !language) {
		res.status(400).json({ error: "Missing docId or language parameter" });
		return;
	}

	const { data: article, error } = await supabase
		.from("articles")
		.select("*")
		.eq("doc_id", docId)
		.single();

	if (error) {
		res.status(404).json({ error: "Article not found" });
		return;
	}

	// Check if the article is in the requested language, if so, send the article
	if (article.original_lang === language) {
		res.status(200).json({ docId, article });
		return;
	}
});

export default articlesRouter;
