import { Router } from "express";

const docsRouter = Router();

docsRouter.get("/", (req, res) => {
	const baseUrl = req.protocol + "://" + req.get("host");

	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Articulate Server API Documentation</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
		h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
		h2 { color: #34495e; margin-top: 30px; }
		.endpoint { background: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 15px 0; border-radius: 5px; }
		.method { background: #27ae60; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 12px; }
		.method.post { background: #e67e22; }
		.path { font-family: 'Monaco', monospace; background: #ecf0f1; padding: 2px 6px; border-radius: 3px; }
		pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
		code { font-family: 'Monaco', monospace; font-size: 14px; }
		.base-url { background: #3498db; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
	</style>
</head>
<body>
	<h1>Articulate Server API Documentation</h1>
	<p><strong>Version:</strong> 0.0.1</p>
	
	<div class="base-url">
		<strong>Base URL:</strong> ${baseUrl}
	</div>

	<div class="endpoint">
		<h2><span class="method">GET</span> <span class="path">/ping</span></h2>
		<p>Health check endpoint to verify server status</p>
		<h3>Response:</h3>
		<pre><code>{
  "data": "active"
}</code></pre>
	</div>

	<div class="endpoint">
		<h2><span class="method post">POST</span> <span class="path">/translations</span></h2>
		<p>Translate an article from a URL into specified language</p>
		<h3>Request Body:</h3>
		<pre><code>{
  "url": "https://example.com/article",
  "language": "es",
  "userId": "user123"
}</code></pre>
		<h3>Response:</h3>
		<pre><code>{
  "doc_id": "abc123def4",
  "article": {
    "id": "uuid",
    "doc_id": "abc123def4",
    "title": "Translated Title",
    "description": "Translated description",
    "author": "Author Name",
    "author_avatar": "https://example.com/avatar.jpg",
    "body": "# Translated markdown content...",
    "cover_photo": "https://example.com/cover.jpg",
    "original_url": "https://example.com/article",
    "published_at": "2024-01-01T00:00:00Z",
    "original_lang": "en",
    "converted_lang": "es",
    "created_at": "2024-01-01T00:00:00Z"
  }
}</code></pre>
	</div>

	<div class="endpoint">
		<h2><span class="method">GET</span> <span class="path">/docs/:docId</span></h2>
		<p>Download translated article as PDF file</p>
		<h3>Parameters:</h3>
		<ul>
			<li><strong>docId:</strong> Document ID from translation response</li>
		</ul>
		<h3>Response:</h3>
		<p>PDF file download with proper headers</p>
	</div>

</body>
</html>
	`;

	res.setHeader("Content-Type", "text/html");
	res.send(html);
});

export default docsRouter;
