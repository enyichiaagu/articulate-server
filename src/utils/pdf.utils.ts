import { marked } from "marked";
import puppeteer from "puppeteer";

interface ArticleMetadata {
	title: string;
	subtitle?: string;
	author: string;
	authorAvatar?: string;
	publicationDate: string;
}

export const convertMarkdownToPdf = async (
	markdown: string,
	metadata: ArticleMetadata
) => {
	const html = marked(markdown);
	console.log("Converted PDF to Markdown");

	const styledHtml = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>${metadata.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap" rel="stylesheet">
			<style>
				body {
					font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					line-height: 1.6;
					max-width: 800px;
					margin: 0 auto;
					padding: 40px 20px;
					color: #333;
				}
				
				.article-header {
					text-align: left;
					margin-bottom: 15px;
					padding-bottom: 20px;
				}
				
				.article-title {
					font-size: 2em;
					color: #1a1a1a;
					margin: 0 0 8px 0;
					font-weight: bold;
					line-height: 1.3;
				}
				
				.article-subtitle {
					font-size: 1.1em;
					color: #6b7280;
					margin: 0 0 15px 0;
					line-height: 1.4;
				}
				
				.author-info {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					gap: 12px;
					margin: 0;
					padding: 15px 0;
					border-top: 1px solid #e5e7eb;
					border-bottom: 1px solid #e5e7eb;
				}
				
				.author-avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					object-fit: cover;
				}
				
				.author-details {
					text-align: left;
				}
				
				.author-name {
					font-weight: 500;
					color: #1a1a1a;
					margin: 0;
					font-size: 0.95em;
				}
				
				.publication-date {
					color: #6b7280;
					font-size: 0.85em;
					margin: 2px 0 0 0;
				}
				
				.page-number {
					position: fixed;
					bottom: 20px;
					right: 20px;
					font-size: 12px;
					color: #666;
				}
				
				h1, h2, h3 { color: #2c3e50; }
				h2 { border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
				code {
					background: #f8f9fa;
					padding: 2px 4px;
					border-radius: 3px;
					font-family: 'Monaco', 'Menlo', monospace;
				}
				pre {
					background: #f8f9fa;
					padding: 15px;
					border-radius: 5px;
					overflow-x: auto;
				}
				blockquote {
					border-left: 4px solid #3498db;
					margin: 0;
					padding-left: 20px;
					font-style: italic;
				}
				a { color: #3498db; text-decoration: none; }
				a:hover { text-decoration: underline; }
				img { max-width: 100%; height: auto; }
				
				@page {
					margin: 0.5in;
				}
			</style>
		</head>
		<body dir="auto">
			<div class="article-header">
				<h1 class="article-title" dir="auto">${metadata.title}</h1>
				${metadata.subtitle ? `<p class="article-subtitle" dir="auto">${metadata.subtitle}</p>` : ""}
				
				<div class="author-info">
					${metadata.authorAvatar ? `<img src="${metadata.authorAvatar}" alt="${metadata.author}" class="author-avatar">` : ""}
					<div class="author-details">
						<p class="author-name">${metadata.author}</p>
						<p class="publication-date" dir="auto">${metadata.publicationDate}</p>
					</div>
				</div>
			</div>
			
			<div class="article-content" dir="auto">
				${html}
			</div>
		</body>
		</html>
	`;
	console.log("Generated HTML Styles");

	const browser = await puppeteer.launch({
		headless: true,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-web-security",
		],
	});
	const page = await browser.newPage();
	await page.setContent(styledHtml);

	const pdf = await page.pdf({
		format: "A4",
		margin: {
			top: "0.5in",
			right: "0.5in",
			bottom: "0.5in",
			left: "0.5in",
		},
		printBackground: true,
		displayHeaderFooter: true,
		headerTemplate: "<div></div>",
		footerTemplate: `
				<div style="font-size: 12px; color: #666; text-align: center; width: 100%;">
					<span class="pageNumber"></span>
				</div>
			`,
	});

	await browser.close();
	return pdf;
};
