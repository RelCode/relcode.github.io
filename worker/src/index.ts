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
		'If none fit, return "contact".';

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
		"If the answer is not in the context, say you do not know based on the knowledge base and suggest contacting Lebo.";

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
			return new Response(JSON.stringify({ answer } satisfies ChatResponse), { status: 200, headers });
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
