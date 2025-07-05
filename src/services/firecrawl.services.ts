import FirecrawlApp from "@mendable/firecrawl-js";

const { FIRECRAWL_API_KEY } = process.env;

if (!FIRECRAWL_API_KEY) throw new Error("Firecrawl API Key is missing");

const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

export default app;
