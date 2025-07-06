import { Router } from "express";
import supabase from "../services/supabase.services.js";
import { convertMarkdownToPdf } from "../utils/pdf.utils.js";

const articlesRouter = Router();

articlesRouter.get("/:docId", async (req, res) => {
	const { docId } = req.params;

	if (!docId) {
		res.status(400).json({ error: "Missing docId parameter" });
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

	try {
		const pdfBuffer = await convertMarkdownToPdf(
			article.body,
			article.title
		);

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`inline; filename="${article.title}.pdf"`
		);
		res.send(pdfBuffer);
	} catch (pdfError) {
		res.status(500).json({ error: "Failed to generate PDF" });
	}
});

export default articlesRouter;
