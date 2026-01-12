import React, { useEffect, useMemo, useState } from 'react';
import ResumeHeader from './components/Hero';
import Summary from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import Services from './components/Services';
import Experience from './components/Projects';
import FooterChatbot from './components/FooterChatbot';
import CommandPalette, { type CommandPaletteAction } from './components/CommandPalette';
import { BotIcon, Search } from 'lucide-react';
import './App.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        const isTypingContext = tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
        if (isTypingContext) return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;
      if (e.altKey || e.shiftKey) return;
      if (e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      setIsPaletteOpen(true);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const actions = useMemo<CommandPaletteAction[]>(() => {
    const scrollTo = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    };

    const openExternal = (url: string) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return [
      {
        id: 'go-top',
        label: 'Go to Top',
        keywords: ['home', 'hero', 'header'],
        hint: 'Section',
        run: () => scrollTo('top'),
      },
      {
        id: 'go-summary',
        label: 'Go to Professional Summary',
        keywords: ['about', 'summary'],
        hint: 'Section',
        run: () => scrollTo('summary'),
      },
      {
        id: 'go-services',
        label: 'Go to What I Can Help With',
        keywords: ['services', 'offerings'],
        hint: 'Section',
        run: () => scrollTo('services'),
      },
      {
        id: 'go-projects',
        label: 'Go to Featured Work',
        keywords: ['projects', 'featured'],
        hint: 'Section',
        run: () => scrollTo('projects'),
      },
      {
        id: 'go-skills',
        label: 'Go to Technical Skills',
        keywords: ['skills', 'stack', 'tech'],
        hint: 'Section',
        run: () => scrollTo('skills'),
      },
      {
        id: 'go-experience',
        label: 'Go to Professional Experience',
        keywords: ['experience', 'work history'],
        hint: 'Section',
        run: () => scrollTo('experience'),
      },
      {
        id: 'go-education',
        label: 'Go to Education',
        keywords: ['education', 'study'],
        hint: 'Section',
        run: () => scrollTo('education'),
      },
      {
        id: 'open-chat',
        label: 'Open AI Chat',
        keywords: ['chatbot', 'ai', 'relbot'],
        hint: 'Utility',
        run: () => setIsChatOpen(true),
      },
      {
        id: 'print',
        label: 'Print / Save as PDF',
        keywords: ['pdf', 'print'],
        hint: 'Utility',
        run: () => window.print(),
      },
      {
        id: 'open-github',
        label: 'Open GitHub',
        keywords: ['repo', 'code'],
        hint: 'External',
        run: () => openExternal('https://github.com/RelCode'),
      },
      {
        id: 'open-linkedin',
        label: 'Open LinkedIn',
        keywords: ['linkedin', 'profile'],
        hint: 'External',
        run: () => openExternal('https://www.linkedin.com/in/relebohile-nkosi-792b99106/'),
      },
      {
        id: 'email',
        label: 'Email Lebo',
        keywords: ['contact', 'mail'],
        hint: 'External',
        run: () => {
          window.location.href =
            'mailto:nkosir2022@gmail.com?subject=Opportunity%20Inquiry&body=Hi%20Lebo%2C%0A%0AI%27m%20reaching%20out%20regarding%3A%20%0A%0ADetails%3A%20%0A%0ATimeline%3A%20%0A%0AThanks%2C';
        },
      },
    ];
  }, []);

  return (
    <div className="app-container">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <main className="resume-paper" id="main-content">
        <ResumeHeader />
        <Summary />
        <div className="divider"></div>
        <Services />
        <div className="divider"></div>
        <ProjectsSection />
        <div className="divider"></div>
        <Skills />
        <div className="divider"></div>
        <Experience />
        <div className="divider"></div>
        <Education />
      </main>

      <FooterChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} actions={actions} />

      <div className={isChatOpen ? 'footer footer-hidden' : 'footer'}>
        <div className="footer-tools">
          <button
            className="command-palette-button"
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <Search size={16} />
            <span className="command-palette-button-text">Search</span>
            <span className="command-palette-button-keys">Ctrl/⌘+K</span>
          </button>
          <button
            className="chatbot-container"
            type="button"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open AI chat"
          >
            <span className="chatbot-text">Chat with AI</span>
            <span className="chatbot-separator" />
            <BotIcon size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
