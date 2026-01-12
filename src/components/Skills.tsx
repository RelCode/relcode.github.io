import React from 'react';
import './Skills.css';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      category: 'Languages',
      skills: 'JavaScript, TypeScript, Python, C#, SQL',
    },
    {
      category: 'Frontend',
      skills: 'React, Angular, HTML5, CSS3, Bootstrap',
    },
    {
      category: 'Backend',
      skills: 'Node.js, Express, REST APIs',
    },
    {
      category: 'Databases',
      skills: 'PostgreSQL, MS SQL Server, MySQL, Supabase',
    },
    {
      category: 'Tools & Technologies',
      skills: 'Git, Docker/Podman, AWS, CI/CD, Jest, Webpack, Linux',
    },
  ];

  return (
    <section className="skills-section" id="skills">
      <h3 className="section-title">Technical Skills</h3>
      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <div className="skill-row" key={index}>
            <span className="skill-category">{category.category}:</span>
            <span className="skill-list">{category.skills}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
