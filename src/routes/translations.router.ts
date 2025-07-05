import { Router } from "express";
import { z } from "zod";
import firecrawl from "../services/firecrawl.services";
import { type ScrapeResponse } from "@mendable/firecrawl-js";

const schema = z.object({
	is_article: z.boolean(),
	article_title: z.string(),
	article_description: z.string(),
	article_writing_as_markdown: z.string(),
});

const translationsRouter = Router();

type reqBody = {
	url?: string;
	language?: string;
};

translationsRouter.post("/", async (req, res) => {
	const data: reqBody = req.body;

	if (!data.url || !data.language) {
		res.status(400).json({ error: "Missing required property" });
		return;
	}

	const result = (await firecrawl.scrapeUrl(data.url, {
		formats: ["json"],
		jsonOptions: { schema },
		maxAge: 3_600_000,
	})) as ScrapeResponse;

	if (!result.success) {
		res.status(500).json({ error: "Internal server Error" });
		return;
	}

	if (!result.json.is_article) {
		res.status(400).json({ error: "URL is not an article" });
	}

	res.status(200).json({ data: result.json });
});

export default translationsRouter;
