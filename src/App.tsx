import React from 'react';
import ResumeHeader from './components/Hero';
import Summary from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import Services from './components/Services';
import Experience from './components/Projects';
import './App.css';

function App() {
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
    </div>
  );
}

export default App;
