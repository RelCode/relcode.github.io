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
		'1. "greeting" - greetings, salutations, pleasantries (hi, hello, hey, good morning, how are you, thanks, etc.)\n' +
		'2. "clarification" - questions about the chatbot rules, functionality, or how to use it (not about Lebo)\n' +
		'3. "question" - actual questions seeking information about Lebo\'s profile, skills, experience, education, background, etc.\n\n' +
		"Important: Be semantic-aware. Questions about education (high school, university, college, tertiary, studies) are questions about Lebo, not clarifications.\n" +
		'Return ONLY the type as a single word: "greeting", "clarification", or "question".';;

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
		"Analyze the question semantically and return one or more relevant keys from the provided list. " +
		'For broad questions (e.g., "tell me about Lebo", "what are the skills"), return multiple relevant keys as a comma-separated list. ' +
		"For specific questions, return just the most relevant key. " +
		'If none fit, return "contact". ' +
		"\n\nSemantic awareness rules:\n" +
		"- Education: 'high school' = 'secondary school', 'college'/'university'/'tertiary'/'qualification'/'degree'/'diploma'/'BTech' = 'early_life' (which contains tertiary_education)\n" +
		"- Skills: 'programming'/'coding'/'development' all relate to 'skills'\n" +
		"- Work: 'job'/'employment'/'career'/'position'/'role' all relate to 'professional_background' or 'career_journey'\n" +
		"- Background: 'childhood'/'upbringing'/'growing up' relate to 'early_life'\n" +
		"- Personal: 'hobbies'/'interests'/'outside work' relate to 'current_interests'\n" +
		"- Future: 'goals'/'aspirations'/'ambitions'/'plans' relate to 'future_goals_and_aspirations'\n" +
		"Think contextually and match intent, not just keywords.";

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
		"You are a portfolio assistant for Lebo Nkosi. Answer ONLY using the provided knowledge base context. " +
		'Treat stated experience/skills as affirmative evidence (e.g., if context says PHP/Laravel experience, answer "yes" to "Have you worked with PHP?"). ' +
		"\n\nSemantic understanding:\n" +
		"- 'High school' = 'secondary school' (South African terminology)\n" +
		"- 'College'/'university'/'tertiary' refer to post-secondary education\n" +
		"- 'Qualification'/'degree'/'diploma'/'BTech' questions should check 'tertiary_education' or 'formal_education' sections\n" +
		"- 'Coding'/'programming'/'development' are interchangeable\n" +
		"- When asked about education/school/qualifications, check 'primary_school', 'secondary_school', 'tertiary_education', and 'formal_education' sections\n" +
		"- Be conversational and natural in your responses\n" +
		"- If the information exists in context but uses different terminology, translate appropriately\n\n" +
		"If the answer is truly not in the context, respond warmly: 'That's a great question! The knowledge base doesn't cover that detail, but you could reach out to Lebo directly to learn more.'";

	const input =
		`Knowledge base context:\n\n${context}\n\n` +
		`User question: ${question}\n\n` +
		"Answer naturally and conversationally, as if you're a knowledgeable assistant who knows Lebo well. Be concise but friendly.";

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

	console.log("[OPENAI_ANSWER] Request to OpenAI, status:", res.status);

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
			
			console.log("[REQUEST] Question:", question);
			
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
			console.log("[CLASSIFICATION]", classification);

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
			console.log("[KEY_SELECTION] Selected keys:", selectedKeys);

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

			console.log("[RESPONSE] Sending answer, length:", answer.length);

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
