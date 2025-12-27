import React, { useState, useEffect } from 'react';
import './Hero.css';

const ResumeHeader: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const skills = [
    'Web Development',
    'Database Management',
    'System Automation',
    'Mobile Application Development',
  ];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % skills.length;
      const fullText = skills[i];

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
  }, [text, isDeleting, loopNum, typingSpeed, skills]);

  return (
    <header className="resume-header">
      <div className="header-content">
        <div className="profile-picture">
          <img src="profilepicture.jpeg" className="profile-picture" alt="Profile" />
        </div>
        <div className="header-text">
          <h1 className="name"><i>Lebo</i> Nkosi</h1>
          <h2 className="title">
            I do <span className="typewriter">{text}</span>
            <span className="cursor">|</span>
          </h2>
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
