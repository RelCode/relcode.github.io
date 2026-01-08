import React from "react";
import "./Services.css";

const Services: React.FC = () => {
	const offerings: string[] = [
		"After-hours bug fixing, debugging, and production support (async-friendly)",
		"Performance optimization, refactoring, and reliability hardening for React/TypeScript apps",
		"AI-adjacent evaluation tooling: LLM regression testing, quality checks, and RAG reliability improvements",
		"Feature development (frontend or full-stack) for internal tools and customer-facing products",
		"Test coverage improvements, CI stabilization, and code quality practices (reviews, patterns, docs)",
	];

	return (
		<section className="services-section">
			<div className="services-header">
				<h3 className="section-title">What I Can Help With</h3>
                <a
                    className="services-cta"
                    href={
                        "mailto:nkosir2022@gmail.com?subject=Engineer%20availability%20enquiry&body=Hi%20there%2C%0A%0AReason%20for%20reaching%20out%3A%20%5Binterview%20invitation%2Ffreelancer%20wanted%2Favailability%20enquiry%2Fother%5D%0A%0AContext%2Flinks%3A%20%0ADeadline%3A%20%0AExpected%20hours%2Fweek%3A%20%0A%0AThanks%2C"
                    }
                >
                    Email me about a project
                </a>
			</div>

			<p className="services-subtitle">
				Best fit for short engagements, after-hours support, and part-time contract work (17:00–02:00 SAST).
			</p>

			<ul className="services-list">
				{offerings.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</section>
	);
};

export default Services;
