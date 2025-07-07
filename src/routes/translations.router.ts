import { Router } from "express";
import { customAlphabet } from "nanoid/non-secure";
import { z } from "zod";
import { type ScrapeResponse } from "@mendable/firecrawl-js";
import TurndownService from "turndown";
import firecrawl from "../services/firecrawl.services.js";
import supabase from "../services/supabase.services.js";
import lingoDotDev from "../services/lingo.services.js";

const turndownService = new TurndownService();

const nanoid = customAlphabet("1234567890abcdef", 10);
const schema = z.object({
	is_article: z.boolean(),
	article_title: z.string(),
	article_subtitle_or_description: z.string(),
	article_body_as_html_easily_convertible_to_markdown_including_newlines_for_paragraphs:
		z.string(),
	human_fullname_of_article_author_if_none_then_company: z.string(),
	article_author_avatar_url_if_any_or_empty_string: z.string(),
	cover_photo_url_if_any_or_empty_string: z.string(),
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

	try {
		console.log("Scraping URL ...");
		const result = (await firecrawl.scrapeUrl(data.url, {
			formats: ["json"],
			jsonOptions: { schema },
			maxAge: 3_600_000,
		})) as ScrapeResponse;
		console.log("Finished Scraping URL");

		if (!result.success) {
			console.log(result);
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
		console.log(
			`Converting article from ${original_lang} to ${converted_lang}`
		);
		let htmlBody = await lingoDotDev.localizeHtml(
			result.json
				.article_body_as_html_easily_convertible_to_markdown_including_newlines_for_paragraphs,
			{ sourceLocale: original_lang, targetLocale: converted_lang }
		);
		console.log(`finished converting article to ${converted_lang}`);
		let mdBody = turndownService.turndown(htmlBody);

		const { article_title, article_subtitle_or_description } = result.json;
		const translatedTitles = await lingoDotDev.localizeObject(
			{ article_title, article_subtitle_or_description },
			{
				sourceLocale: original_lang,
				targetLocale: converted_lang,
			}
		);

		const { data: article, error } = await supabase
			.from("articles")
			.insert({
				doc_id,
				title: translatedTitles.article_title,
				description: translatedTitles.article_subtitle_or_description,
				author: result.json
					.human_fullname_of_article_author_if_none_then_company,
				author_avatar:
					result.json
						.article_author_avatar_url_if_any_or_empty_string,
				body: mdBody,
				published_at: result.metadata?.publishedTime
					? new Date(result.metadata.publishedTime).toISOString()
					: null,
				user: data.userId,
				original_url: result.metadata?.sourceURL || data.url,
				cover_photo:
					result.json.cover_photo_url_if_any_or_empty_string || null,
				original_lang,
				converted_lang,
			})
			.select()
			.single();

		if (error) {
			console.log(error);
			res.status(500).json({ error: "Database error" });
			return;
		}

		res.status(200).json({ doc_id, article });
		return;
	} catch (error) {
		console.log("Server Error", error);
		res.status(500).json({ error: "Internal server Error" });
		return;
	}
});

export default translationsRouter;
