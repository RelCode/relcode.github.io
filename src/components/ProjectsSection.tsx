import React from 'react';
import './ProjectsSection.css';

interface ProjectItem {
  title: string;
  technologies: string;
  description: string[];
}

const Projects: React.FC = () => {
  const projects: ProjectItem[] = [
    {
      title: 'E-Commerce Platform',
      technologies: 'React, Node.js, MongoDB, PayFast API',
      description: [
        'Built a full-stack e-commerce application with authentication, product browsing, and checkout flows',
        'Designed and implemented REST APIs with Express.js to support core storefront operations',
        'Integrated PayFast payments with secure transaction handling and clear error states for users',
      ],
    },
    {
      title: 'CRM System',
      technologies: 'React, TypeScript, PHP, MySQL',
      description: [
        'Developed a CRM-style workflow tool for task tracking and team collaboration',
        'Implemented role-based access control and permissions for safer multi-user operation',
        'Built responsive UI patterns and backend endpoints to support day-to-day operations',
      ],
    },
    {
      title: 'Ledger App',
      technologies: 'React Native, Supabase, Render',
      description: [
        'Created a mobile app for personal finance tracking with a focus on usability and data integrity',
        'Used Supabase for authentication and persistence, keeping the system simple and maintainable',
        'Deployed supporting services on Render for straightforward environments and repeatable releases',
      ],
    },
    {
        title: 'LLM-as-a-Judge Platform',
        technologies: 'Python, FastAPI, Azure OpenAI + DeepSeek-3b params local, Podman',
        description: [
            'Built an evaluation-focused platform that uses LLMs as judges for scenario-based assessments',
            'Implemented a FastAPI backend for orchestration, prompt execution, and response handling',
            'Integrated Azure OpenAI and a local model option to support different execution environments',
            'Containerized with Podman to keep runs consistent across machines and deployments',
        ]
    }
  ];

  return (
    <section className="projects-section" id="projects">
      <h3 className="section-title">Featured Work</h3>
      {projects.map((project, index) => (
        <div key={index} className="project-item">
          <h4 className="project-title">{project.title}</h4>
          <div className="technologies">{project.technologies}</div>
          <ul className="project-description">
            {project.description.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Projects;
