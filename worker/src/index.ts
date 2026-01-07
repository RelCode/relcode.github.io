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

function getAllowedOrigin(requestOrigin: string | null, allowedOrigins: string): string {
  const list = allowedOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.includes('*')) return requestOrigin || '*';
  if (!requestOrigin) return '';
  return list.includes(requestOrigin) ? requestOrigin : '';
}

function withCors(headers: Headers, origin: string) {
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Vary', 'Origin');
}

function chunkText(text: string): string[] {
  const blocks = text
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const b of blocks) {
    if (b.length <= 800) {
      chunks.push(b);
      continue;
    }
    for (let i = 0; i < b.length; i += 800) {
      chunks.push(b.slice(i, i + 800));
    }
  }
  return chunks;
}

function scoreChunk(question: string, chunk: string): number {
  const q = question.toLowerCase();
  const c = chunk.toLowerCase();
  const terms = q
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);

  let score = 0;
  for (const t of terms) {
    if (c.includes(t)) score += 1;
  }
  return score;
}

async function fetchProfile(env: Env): Promise<string> {
  const res = await fetch(env.PROFILE_URL, {
    headers: { 'User-Agent': 'portfolio-chat-worker' },
  });
  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
  return await res.text();
}

async function answerWithOpenAI(env: Env, question: string, context: string): Promise<string> {
  const system =
    'You are a portfolio assistant. Answer ONLY using the provided knowledge base context. ' +
    'If the answer is not in the context, say you do not know based on the knowledge base and suggest contacting Lebo.';

  const input =
    `Knowledge base context:\n\n${context}\n\n` +
    `User question: ${question}\n\n` +
    'Answer in a concise, recruiter-friendly way.';

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: input },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `OpenAI error: ${res.status}`);
  }

  const data = (await res.json()) as any;
  const outputText =
    (data.output_text as string | undefined) ||
    (data.output?.[0]?.content?.[0]?.text as string | undefined) ||
    '';

  return outputText.trim() || "I couldn't generate an answer from the knowledge base.";
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = getAllowedOrigin(request.headers.get('Origin'), env.ALLOWED_ORIGINS || '*');

    if (!origin) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      const headers = new Headers();
      withCors(headers, origin);
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/chat') {
      return new Response('Not found', { status: 404 });
    }

    if (request.method !== 'POST') {
      const headers = new Headers();
      withCors(headers, origin);
      return new Response('Method not allowed', { status: 405, headers });
    }

    try {
      const body = (await request.json()) as ChatRequest;
      const question = (body.question || '').trim();
      if (!question) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        withCors(headers, origin);
        return new Response(JSON.stringify({ answer: 'Please ask a question.' } satisfies ChatResponse), {
          status: 400,
          headers,
        });
      }

      const profile = await fetchProfile(env);
      const chunks = chunkText(profile);
      const ranked = chunks
        .map((chunk) => ({ chunk, score: scoreChunk(question, chunk) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((x) => x.chunk)
        .join('\n\n---\n\n');

      const answer = await answerWithOpenAI(env, question, ranked || profile);

      const headers = new Headers({ 'Content-Type': 'application/json' });
      withCors(headers, origin);
      return new Response(JSON.stringify({ answer } satisfies ChatResponse), { status: 200, headers });
    } catch (err) {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      withCors(headers, origin);
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ answer: `Error: ${message}` } satisfies ChatResponse), {
        status: 500,
        headers,
      });
    }
  },
};

export default worker;
