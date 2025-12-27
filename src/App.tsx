import React from 'react';
import ResumeHeader from './components/Hero';
import Summary from './components/About';
import Experience from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="resume-paper">
        <ResumeHeader />
        <Summary />
        <div className="divider"></div>
        <Skills />
        <div className="divider"></div>
        <Experience />
        <div className="divider"></div>
        <Education />
        <div className="divider"></div>
        <ProjectsSection />
      </div>
    </div>
  );
}

export default App;
