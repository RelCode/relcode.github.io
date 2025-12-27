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
        'Developed full-stack e-commerce application with user authentication and payment processing',
        'Implemented RESTful API with Express.js serving multiple client applications',
        'Integrated PayFast payment gateway for secure transactions',
      ],
    },
    {
      title: 'CRM System',
      technologies: 'React, TypeScript, PHP, MySQL, Material-UI',
      description: [
        'Built collaborative task management tool with real-time synchronization',
        'Designed responsive UI with modern components',
        'Implemented role-based access control and team collaboration features',
      ],
    },
    {
      title: 'Ledger App',
      technologies: 'React Native, Supabase, Render',
      description: [
        'Created mobile application for personal finance tracking with offline capabilities',
        'Utilized Supabase for backend services including authentication and database management',
        'Deployed backend on Render for scalable and reliable performance',
      ],
    },
    {
        title: 'LLM-as-a-Judge Platform',
        technologies: 'Python, FastAPI, Azure OpenAI + DeepSeek-3b params local, Podman',
        description: [
            'Developed a platform leveraging large language models to act as judges in legal scenarios',
            'Implemented FastAPI backend to handle requests and manage AI interactions',
            'Utilized Azure OpenAI services for advanced natural language processing capabilities',
            'Containerized application using Podman for consistent deployment across environments',
        ]
    }
  ];

  return (
    <section className="projects-section">
      <h3 className="section-title">Projects</h3>
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
