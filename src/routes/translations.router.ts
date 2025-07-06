import { Router } from "express";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { type ScrapeResponse } from "@mendable/firecrawl-js";
import TurndownService from "turndown";
import firecrawl from "../services/firecrawl.services";
import supabase from "../services/supabase.services";
import lingoDotDev from "../services/lingo.services";

const turndownService = new TurndownService();

const nanoid = customAlphabet("1234567890abcdef", 10);
const schema = z.object({
	is_article: z.boolean(),
	article_title: z.string(),
	article_subtitle_or_description: z.string(),
	article_writing_as_html_easily_convertible_to_markdown: z.string(),
	author: z.string(),
	author_avatar_url_if_any_or_empty_string: z.string(),
});

const translationsRouter = Router();

type reqBody = {
	url: string;
	language: string;
	userId: string;
};

translationsRouter.post("/", async (req, res) => {
	const data: reqBody = req.body;

	if (!data.url || !data.language || !data.userId) {
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
		return;
	}

	let doc_id = nanoid();
	let original_lang = result.metadata?.language || "en";
	let converted_lang = data.language;
	let htmlBody = await lingoDotDev.localizeHtml(
		result.json.article_writing_as_html_easily_convertible_to_markdown,
		{ sourceLocale: original_lang, targetLocale: converted_lang }
	);
	let mdBody = turndownService.turndown(htmlBody);

	const { data: article, error } = await supabase
		.from("articles")
		.insert({
			doc_id,
			title: result.json.article_title,
			description: result.json.article_subtitle_or_description,
			author: result.json.author,
			author_avatar: result.json.author_avatar_url_if_any_or_empty_string,
			body: mdBody,
			published_at: result.metadata?.publishedTime
				? new Date(result.metadata.publishedTime).toISOString()
				: null,
			user: data.userId,
			original_url: result.metadata?.sourceURL || data.url,
			original_lang,
			converted_lang,
		})
		.select()
		.single();

	if (error) {
		res.status(500).json({ error: "Database error" });
		return;
	}

	res.status(200).json({ doc_id, article });
});

export default translationsRouter;
