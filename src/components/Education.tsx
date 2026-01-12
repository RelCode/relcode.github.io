import React from 'react';
import './Education.css';

interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details?: string[];
}

const Education: React.FC = () => {
  const education: EducationItem[] = [
    {
        degree: 'National Diploma in Information Technology',
        institution: 'University of Johannesburg',
        location: 'Johannesburg, South Africa',
        period: 'Jan 2016 - Dec 2019',
        details: [
          'GPA: 3.2/4.0',
          'Relevant Coursework: Programming, Database Management, Network Fundamentals, Web Development'
        ],
    },
    {
      degree: 'Bachelor of Technology in Business Information Technology',
      institution: 'University of Johannesburg',
      location: 'Johannesburg, South Africa',
      period: 'Jan 2025 - December 2025',
      details: [
        'GPA: 3.6/4.0',
        'Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems, AI in the field of Business',
      ],
    },
  ];

  return (
    <section className="education-section" id="education">
      <h3 className="section-title">Education</h3>
      {education.map((edu, index) => (
        <div key={index} className="education-item">
          <div className="education-header">
            <h4 className="degree">{edu.degree}</h4>
            <span className="period">{edu.period}</span>
          </div>
          <div className="institution-info">
            {edu.institution} • {edu.location}
          </div>
          {edu.details && (
            <ul className="education-details">
              {edu.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
};

export default Education;
