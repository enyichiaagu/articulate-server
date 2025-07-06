import { marked } from "marked";
import puppeteer from "puppeteer";

export const convertMarkdownToPdf = async (markdown: string, title: string) => {
	const html = marked(markdown);
	console.log("Converted PDF to Markdown");

	const styledHtml = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>${title}</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					line-height: 1.6;
					max-width: 800px;
					margin: 0 auto;
					padding: 40px 20px;
					color: #333;
				}
				h1, h2, h3 { color: #2c3e50; }
				h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
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
			</style>
		</head>
		<body>
			${html}
		</body>
		</html>
	`;
	console.log("Generated HTML Styles");
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setContent(styledHtml);

		const pdf = await page.pdf({
			format: "A4",
			margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
			printBackground: true,
		});

		await browser.close();
		return pdf;
	} catch (error) {
		console.log("Error generating PDF:", error);
	}
};
