import { LingoDotDevEngine } from "lingo.dev/sdk";

const LINGO_KEY = process.env.LINGO_KEY;
if (!LINGO_KEY) {
	throw new Error("LINGO_KEY not found");
}

const lingoDotDev = new LingoDotDevEngine({
	apiKey: LINGO_KEY,
});

export default lingoDotDev;
