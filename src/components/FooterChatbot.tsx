import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import "./FooterChatbot.css";

type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

type ChatResponse = {
	answer: string;
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const FooterChatbot: React.FC<Props> = ({ isOpen, onClose }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content:
				"Hi, I’m RelBot — your friendly portfolio genie. You get 3 questions. Ask me anything about Lebo (work, projects, preferences, even fun personal curiosities). If it’s not covered by the portfolio knowledge base, I’ll tell you I don’t know — no guessing.",
		},
	]);
	const [question, setQuestion] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const listRef = useRef<HTMLDivElement | null>(null);

	const apiUrl = useMemo(() => {
		return (
			process.env.REACT_APP_AI_CHAT_API_URL ||
			"https://portfolio-chat.princefana7.workers.dev/api/chat"
		);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setIsMounted(true);
			const raf = requestAnimationFrame(() => setIsVisible(true));
			return () => cancelAnimationFrame(raf);
		}

		setIsVisible(false);
		const t = window.setTimeout(() => setIsMounted(false), 240);
		return () => window.clearTimeout(t);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		const el = listRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [isOpen, messages, isLoading, error]);

	const askedCount = messages.filter((m) => m.role === "user").length;
	const questionsLeft = Math.max(0, 3 - askedCount);
	const hasQuestionsLeft = questionsLeft > 0;
	const canSend = question.trim().length > 0 && !isLoading && hasQuestionsLeft;

	const send = async () => {
		const trimmed = question.trim();
		if (!trimmed || isLoading) return;

		if (!hasQuestionsLeft) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"Wish limit reached — that’s 3 questions for this session. Refresh the page to ask again, or email Lebo if you want to chat further.",
				},
			]);
			return;
		}

		setError(null);
		setQuestion("");
		setIsLoading(true);

		setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

		try {
			const res = await fetch(apiUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: trimmed }),
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || `Request failed: ${res.status}`);
			}

			const data = (await res.json()) as ChatResponse;
			setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unknown error";
			setError(message);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"Sorry — I could not reach the chat service right now. If you want, email me and I’ll respond directly.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await send();
	};

	if (!isMounted) return null;

	return (
		<div
			className={isVisible ? "footer-chatbot is-open" : "footer-chatbot"}
			role="dialog"
			aria-label="AI portfolio chatbot"
			aria-hidden={!isVisible}
		>
			<div className="footer-chatbot-header">
				<div className="footer-chatbot-title">Chat with AI</div>
				<button className="footer-chatbot-close" type="button" onClick={onClose} aria-label="Close chat">
					<X size={18} />
				</button>
			</div>

			<div className="footer-chatbot-body" ref={listRef}>
				{messages.map((m, idx) => (
					<div key={idx} className={m.role === "user" ? "msg user" : "msg assistant"}>
						{m.content}
					</div>
				))}
				{isLoading ? <div className="msg assistant">Thinking…</div> : null}
				{error ? <div className="footer-chatbot-error">{error}</div> : null}
			</div>

			<form className="footer-chatbot-input" onSubmit={onSubmit}>
				<input
					className="footer-chatbot-text"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder={hasQuestionsLeft ? `Ask a question… (${questionsLeft} left)` : "No questions left"}
					disabled={!hasQuestionsLeft}
				/>
				<button className="footer-chatbot-send" type="submit" disabled={!canSend}>
					Send
				</button>
			</form>
		</div>
	);
};

export default FooterChatbot;
