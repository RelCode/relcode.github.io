import React, { useState } from 'react';
import ResumeHeader from './components/Hero';
import Summary from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import Services from './components/Services';
import Experience from './components/Projects';
import FooterChatbot from './components/FooterChatbot';
import { BotIcon } from 'lucide-react';
import './App.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="resume-paper">
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
      </div>

      <FooterChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className={isChatOpen ? 'footer footer-hidden' : 'footer'}>
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
  );
}

export default App;
