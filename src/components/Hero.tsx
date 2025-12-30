import React, { useEffect, useState } from 'react';
import './Hero.css';

const ROTATING_SKILLS = [
  'Web Development',
  'Database Management',
  'System Automation',
  'Mobile Application Development',
];

const ResumeHeader: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % ROTATING_SKILLS.length;
      const fullText = ROTATING_SKILLS[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <header className="resume-header">
      <div className="header-content">
        <div className="profile-picture">
          <img src="profilepicture.jpeg" alt="Profile" />
        </div>
        <div className="header-text">
          <h1 className="name"><i>Lebo</i> Nkosi</h1>
          <h2 className="title">
            I do <span className="typewriter">{text}</span>
            <span className="cursor">|</span>
          </h2>
          <p className="tagline">Software Engineer (7+ years) • Remote-first • AI &amp; Full-stack</p>
          <p className="hero-pitch">
            I build and maintain production-grade web applications and AI-adjacent tooling — with a focus on reliability,
            performance, and clean engineering practices.
          </p>
        </div>
      </div>
      <div className="contact-info">
        <div className="contact-item">
          <a href="mailto:nkosir2022@gmail.com">nkosir2022@gmail.com</a>
        </div>
        <span className="separator">•</span>
        <div className="contact-item">
          <a href="tel:+27624171162">+27 (62) 417-1162</a>
        </div>
        <span className="separator">•</span>
        <div className="contact-item">
          <span>Cape Town/Johannesburg/Remote</span>
        </div>
      </div>
      <div className="availability">
        Availability: Remote contract work • After-hours support (17:00–02:00 SAST) • U.S. time zones friendly
      </div>
      <div className="social-links">
        <a href="https://www.linkedin.com/in/relebohile-nkosi-792b99106/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <span className="separator">|</span>
        <a href="https://github.com/RelCode" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
      <div className="header-divider"></div>
    </header>
  );
};

export default ResumeHeader;
