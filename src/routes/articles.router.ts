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
		console.log(error);
		res.status(404).json({ error: "Article not found" });
		return;
	}

	try {
		const pdfBuffer = await convertMarkdownToPdf(article.body, {
			title: article.title,
			subtitle: article.description || "",
			author: article.author,
			authorAvatar: article.author_avatar || "",
			// make the date human readable according to the converted_lang of the article
			publicationDate: new Date(article.created_at).toLocaleDateString(
				article.converted_lang,
				{
					year: "numeric",
					month: "long",
					day: "numeric",
				}
			),
		});

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`inline; filename="${article.doc_id}.pdf"`
		);
		res.send(pdfBuffer);
	} catch (pdfError) {
		console.error("Error generating PDF:", pdfError);
		res.status(500).json({ error: "Failed to generate PDF" });
	}
});

export default articlesRouter;
