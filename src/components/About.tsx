import React from 'react';
import './About.css';

const Summary: React.FC = () => {
  return (
    <section className="summary-section">
      <h3 className="section-title">Professional Summary</h3>
      <p className="summary-text">
        Software Engineer with 7+ years of experience and enterprise exposure building production web applications and AI-adjacent tooling.
        I help teams ship reliable features, improve performance, and raise code quality through pragmatic engineering
        practices (testing, code reviews, and maintainable architecture). Open to remote contract work and after-hours
        engagements.
      </p>
    </section>
  );
};

export default Summary;
