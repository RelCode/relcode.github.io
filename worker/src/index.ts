export interface Env {
	OPENAI_API_KEY: string;
	PROFILE_URL: string;
	ALLOWED_ORIGINS: string;
	OPENAI_MODEL: string;
}

type ChatRequest = {
	question?: string;
};

type ChatResponse = {
	answer: string;
	countsAsQuestion?: boolean;
};

type ProfileMetadata = {
	description: string;
	available_attributes: string[];
	query_handling: string;
};

type ProfileJson = {
	_metadata: ProfileMetadata;
	[key: string]: any;
};

function getAllowedOrigin(requestOrigin: string | null, allowedOrigins: string): string {
	const list = allowedOrigins
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

	if (list.includes("*")) return requestOrigin || "*";
	if (!requestOrigin) return "";
	return list.includes(requestOrigin) ? requestOrigin : "";
}

function withCors(headers: Headers, origin: string) {
	headers.set("Access-Control-Allow-Origin", origin);
	headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
	headers.set("Access-Control-Allow-Headers", "Content-Type");
	headers.set("Vary", "Origin");
}

async function fetchProfileJson(env: Env): Promise<ProfileJson> {
	const res = await fetch(env.PROFILE_URL, {
		headers: { "User-Agent": "portfolio-chat-worker" },
	});
	if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);

	const text = await res.text();
	try {
		const json = JSON.parse(text) as ProfileJson;
		if (!json || typeof json !== "object") throw new Error("Invalid profile JSON");
		return json;
	} catch {
		throw new Error("PROFILE_URL did not return valid JSON");
	}
}

async function classifyMessage(env: Env, message: string): Promise<{ type: "greeting" | "clarification" | "question"; shouldCount: boolean }> {
	const system =
		"You classify user messages into three types:\n" +
		'1. "greeting" - greetings, salutations, pleasantries (hi, hello, hey, good morning, how are you, etc.)\n' +
		'2. "clarification" - questions about the chatbot rules, functionality, or how to use it (not about Lebo)\n' +
		'3. "question" - actual questions seeking information about Lebo\'s profile, skills, experience, etc.\n\n' +
		'Return ONLY the type as a single word: "greeting", "clarification", or "question".';

	const res = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: env.OPENAI_MODEL || "gpt-4o-mini",
			input: [
				{ role: "system", content: system },
				{ role: "user", content: `Classify this message: "${message}"` },
			],
			max_output_tokens: 10,
		}),
	});

	if (!res.ok) {
		// If classification fails, treat as question to be safe
		return { type: "question", shouldCount: true };
	}

	const data = (await res.json()) as any;
	const outputText =
		(data.output_text as string | undefined) || (data.output?.[0]?.content?.[0]?.text as string | undefined) || "question";

	const type = outputText.trim().toLowerCase() as "greeting" | "clarification" | "question";
	
	// Only count actual questions against the limit
	const shouldCount = type === "question";
	
	return { type, shouldCount };
}

async function selectKeysWithOpenAI(
	env: Env,
	question: string,
	keys: string[],
	metadata: ProfileMetadata
): Promise<string[]> {
	const system =
		"You route user questions to knowledge-base section keys. " +
		"Analyze the question and return one or more relevant keys from the provided list. " +
		'For broad questions (e.g., "tell me about Lebo", "what are the skills"), return multiple relevant keys as a comma-separated list. ' +
		"For specific questions, return just the most relevant key. " +
		'If none fit, return "contact".' +
        "Be careful of ambiguity, e.g, (high school and secondary school means the same thing). Sometimes users will ask questions that loosely means something you might think it's not covered. Think deeply in cases like those one"

	const input =
		`Available keys:\n${keys.join(", ")}\n\n` +
		`Metadata guidance: ${metadata.query_handling}\n\n` +
		`Question: ${question}\n\n` +
		"Return one or more keys as comma-separated values, no extra text.";

	const res = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: env.OPENAI_MODEL || "gpt-4o-mini",
			input: [
				{ role: "system", content: system },
				{ role: "user", content: input },
			],
			max_output_tokens: 50,
		}),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `OpenAI error: ${res.status}`);
	}

	const data = (await res.json()) as any;
	const outputText =
		(data.output_text as string | undefined) || (data.output?.[0]?.content?.[0]?.text as string | undefined) || "";

	const selectedKeys = outputText
		.trim()
		.replace(/^"|"$/g, "")
		.split(",")
		.map((k) => k.trim())
		.filter((k) => keys.includes(k));

	return selectedKeys.length > 0 ? selectedKeys : ["contact"];
}

async function answerWithOpenAI(env: Env, question: string, context: string): Promise<string> {
	const system =
		"You are a portfolio assistant. Answer ONLY using the provided knowledge base context. " +
		'Treat stated experience/skills as affirmative evidence (e.g., if context says PHP/Laravel experience, answer "yes" to "Have you worked with PHP?"). ' +
        'Watch for words with loose similarity such as high school and secondary since they mean the same thing but the knowledge base only covers secondary school.' +
		"If the answer is not in the context, say something witty and fun like 'You might want to hire Lebo and ask him about that'";

	const input =
		`Knowledge base context:\n\n${context}\n\n` +
		`User question: ${question}\n\n` +
		"Answer in a concise, recruiter-friendly way.";

	const res = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: env.OPENAI_MODEL || "gpt-4o-mini",
			input: [
				{ role: "system", content: system },
				{ role: "user", content: input },
			],
		}),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `OpenAI error: ${res.status}`);
	}

	const data = (await res.json()) as any;
	const outputText =
		(data.output_text as string | undefined) || (data.output?.[0]?.content?.[0]?.text as string | undefined) || "";

	return outputText.trim() || "I couldn't generate an answer from the knowledge base.";
}

const worker = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = getAllowedOrigin(request.headers.get("Origin"), env.ALLOWED_ORIGINS || "*");

		if (!origin) {
			return new Response("Forbidden", { status: 403 });
		}

		if (request.method === "OPTIONS") {
			const headers = new Headers();
			withCors(headers, origin);
			return new Response(null, { status: 204, headers });
		}

		const url = new URL(request.url);
		if (url.pathname !== "/api/chat") {
			return new Response("Not found", { status: 404 });
		}

		if (request.method !== "POST") {
			const headers = new Headers();
			withCors(headers, origin);
			return new Response("Method not allowed", { status: 405, headers });
		}

		try {
			const body = (await request.json()) as ChatRequest;
			const question = (body.question || "").trim();
			if (!question) {
				const headers = new Headers({ "Content-Type": "application/json" });
				withCors(headers, origin);
				return new Response(JSON.stringify({ answer: "Please ask a question." } satisfies ChatResponse), {
					status: 400,
					headers,
				});
			}

			const profile = await fetchProfileJson(env);

			if (!profile._metadata || !Array.isArray(profile._metadata.available_attributes)) {
				throw new Error("Profile JSON missing valid _metadata.available_attributes");
			}

			// Classify the message type
			const classification = await classifyMessage(env, question);

			// Handle greetings
			if (classification.type === "greeting") {
				const greetingResponse = 
					"Hello! 👋 I'm Lebo's portfolio assistant. I can answer questions about his background, skills, experience, and projects. " +
					"Feel free to ask me anything about Lebo's professional journey!";
				
				const headers = new Headers({ "Content-Type": "application/json" });
				withCors(headers, origin);
				return new Response(
					JSON.stringify({ answer: greetingResponse, countsAsQuestion: false } satisfies ChatResponse),
					{ status: 200, headers }
				);
			}

			// Handle clarifications about the chatbot
			if (classification.type === "clarification") {
				const clarificationResponse =
					"I'm designed to answer questions about Lebo Nkosi's professional background, skills, experience, and projects. " +
					"You have 3 questions per session (resets after 8-12 hours). Greetings and questions about how I work don't count against your limit. " +
					"What would you like to know about Lebo?";
				
				const headers = new Headers({ "Content-Type": "application/json" });
				withCors(headers, origin);
				return new Response(
					JSON.stringify({ answer: clarificationResponse, countsAsQuestion: false } satisfies ChatResponse),
					{ status: 200, headers }
				);
			}

			// Handle actual questions (counts against limit)
			const keys = profile._metadata.available_attributes;
			if (keys.length === 0) throw new Error("Profile JSON has no available attributes");

			const selectedKeys = await selectKeysWithOpenAI(env, question, keys, profile._metadata);

			// Build context from selected keys
			const contextParts: string[] = [];
			for (const key of selectedKeys) {
				if (profile[key]) {
					contextParts.push(`\n=== ${key.toUpperCase()} ===`);
					contextParts.push(JSON.stringify(profile[key], null, 2));
				}
			}

			const context =
				`Selected sections: ${selectedKeys.join(", ")}\n` +
				`\nRelevant information from knowledge base:\n` +
				contextParts.join("\n");

			const answer = await answerWithOpenAI(env, question, context);

			const headers = new Headers({ "Content-Type": "application/json" });
			withCors(headers, origin);
			return new Response(
				JSON.stringify({ answer, countsAsQuestion: true } satisfies ChatResponse),
				{ status: 200, headers }
			);
		} catch (err) {
			const headers = new Headers({ "Content-Type": "application/json" });
			withCors(headers, origin);
			const message = err instanceof Error ? err.message : "Unknown error";
			return new Response(JSON.stringify({ answer: `Error: ${message}` } satisfies ChatResponse), {
				status: 500,
				headers,
			});
		}
	},
};

export default worker;
