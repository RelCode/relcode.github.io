import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CommandPalette.css";

export type CommandPaletteAction = {
	id: string;
	label: string;
	keywords?: string[];
	hint?: string;
	run: () => void;
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	actions: CommandPaletteAction[];
};

const normalize = (value: string) => value.trim().toLowerCase();

const CommandPalette: React.FC<Props> = ({ isOpen, onClose, actions }) => {
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);

	const dialogRef = useRef<HTMLDivElement | null>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const listRef = useRef<HTMLDivElement | null>(null);

	const filtered = useMemo(() => {
		const q = normalize(query);
		if (!q) return actions;

		return actions.filter((a) => {
			const haystack = [a.label, ...(a.keywords || [])].map(normalize).join(" ");
			return haystack.includes(q);
		});
	}, [actions, query]);

	useEffect(() => {
		if (!isOpen) return;
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
		setQuery("");
		setActiveIndex(0);
		const raf = requestAnimationFrame(() => inputRef.current?.focus());
		return () => cancelAnimationFrame(raf);
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) return;
		previouslyFocusedRef.current?.focus?.();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		// Prevent background scroll while open.
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prevOverflow;
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				const dialog = dialogRef.current;
				if (!dialog) return;
				const active = document.activeElement;
				if (!active || !dialog.contains(active)) return;

				const focusable = Array.from(
					dialog.querySelectorAll<HTMLElement>(
						"button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])"
					)
				).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

				if (focusable.length === 0) return;

				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				const isShift = e.shiftKey;

				if (!isShift && active === last) {
					e.preventDefault();
					first.focus();
					return;
				}
				if (isShift && active === first) {
					e.preventDefault();
					last.focus();
					return;
				}
			}

			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
				return;
			}

			if (e.key === "ArrowDown") {
				e.preventDefault();
				setActiveIndex((prev) => Math.min(prev + 1, Math.max(0, filtered.length - 1)));
				return;
			}

			if (e.key === "ArrowUp") {
				e.preventDefault();
				setActiveIndex((prev) => Math.max(prev - 1, 0));
				return;
			}

			if (e.key === "Enter") {
				// Avoid triggering on IME composition.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const anyEvent = e as any;
				if (anyEvent.isComposing) return;

				e.preventDefault();
				const selected = filtered[activeIndex];
				if (!selected) return;
				onClose();
				selected.run();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [activeIndex, filtered, isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		const list = listRef.current;
		if (!list) return;
		const active = list.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | null;
		if (!active) return;
		active.scrollIntoView({ block: "nearest" });
	}, [activeIndex, isOpen]);

	if (!isOpen) return null;

	return (
		<div className="command-palette-backdrop" role="presentation" onMouseDown={onClose}>
			<div
				ref={dialogRef}
				className="command-palette"
				role="dialog"
				aria-modal="true"
				aria-labelledby="command-palette-title"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="command-palette-header">
					<div id="command-palette-title" className="sr-only">
						Command palette
					</div>
					<input
						ref={inputRef}
						className="command-palette-input"
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setActiveIndex(0);
						}}
						placeholder="Type a command…"
						aria-label="Search commands"
						autoComplete="off"
						spellCheck={false}
					/>
					<div className="command-palette-hint">Esc to close</div>
				</div>

				<div className="command-palette-list" ref={listRef} role="listbox" aria-label="Commands">
					{filtered.length === 0 ? (
						<div className="command-palette-empty">No matches</div>
					) : (
						filtered.map((a, idx) => (
							<button
								key={a.id}
								type="button"
								className={idx === activeIndex ? "command-palette-item is-active" : "command-palette-item"}
								onMouseEnter={() => setActiveIndex(idx)}
								onClick={() => {
									onClose();
									a.run();
								}}
								role="option"
								aria-selected={idx === activeIndex}
								data-index={idx}
							>
								<span className="command-palette-item-label">{a.label}</span>
								{a.hint ? <span className="command-palette-item-hint">{a.hint}</span> : null}
							</button>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default CommandPalette;
