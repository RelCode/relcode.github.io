import React from "react";
import "./Projects.css";

interface ExperienceItem {
	title: string;
	company: string;
	location: string;
	period: string;
	responsibilities: string[];
}

const Experience: React.FC = () => {
	const experiences: ExperienceItem[] = [
		{
			title: "Software Engineer III",
			company: "LexisNexis South Africa",
			location: "Remote",
			period: "Sept 2024 - Present",
			responsibilities: [
				"Delivered production-grade React + TypeScript features for a legal professionals platform, focusing on reliability, usability, and maintainability",
				"Integrated AI capabilities using Azure OpenAI; built LLM evaluation and regression testing tooling and contributed to RAG workflows in Python with Angular-based UI components",
				"Improved retrieval and answer-generation quality by iterating on retrieval strategies and evaluation signals to reduce brittle responses",
				"Led code reviews, mentored a junior engineer, and hosted knowledge-sharing sessions on practical LLM integration patterns",
				"Partnered with CloudOps on infrastructure needs (IaC templates for databases, S3 buckets, and supporting services)",
				"Strengthened engineering quality by driving toward higher automated test coverage across Angular and Python codebases",
			],
		},
		{
			title: "Software Engineer I",
			company: "Eezipay",
			location: "Technopark, Stellenbosch",
			period: "Oct 2022 - Jun 2024",
			responsibilities: [
				"Built and maintained full-stack features across React, Node.js, and PHP in an Agile delivery environment",
				"Led a Nedbank integration project and shipped a holiday management microservice to support internal workflows",
				"Implemented similarity search (Levenshtein-based) and delivered reusable UI utilities (custom tooltip library)",
				"Improved confidence in releases through unit and integration testing, raising coverage and reducing regressions",
			],
		},
		{
			title: "Junior System Automator",
			company: "Prolific Technologies",
			location: "Jet Park, Kempton Park",
			period: "Dec 2019 - Sept 2022",
			responsibilities: [
				"Built web apps and databases to capture and visualize production machine data for operational decision-making",
				"Automated data collection and reporting pipelines to reduce manual effort and improve data consistency",
				"Maintained servers, network infrastructure, and client websites to support production uptime",
			],
		},
		{
			title: "Web Developer, Intern",
			company: "Abangani Media",
			location: "Braamfontein, Johannesburg",
			period: "Jul 2017 - Jul 2019",
			responsibilities: [
				"Built responsive web interfaces using HTML, CSS, and JavaScript, with attention to cross-browser behavior",
				"Maintained legacy code and collaborated in Agile ceremonies to ship incremental improvements",
			],
		},
	];

	return (
		<section className="experience-section">
			<h3 className="section-title">Professional Experience</h3>
			{experiences.map((exp, index) => (
				<div key={index} className="experience-item">
					<div className="experience-header">
						<h4 className="job-title">{exp.title}</h4>
						<span className="period">{exp.period}</span>
					</div>
					<div className="company-info">
						{exp.company} • {exp.location}
					</div>
					<ul className="responsibilities">
						{exp.responsibilities.map((resp, idx) => (
							<li key={idx}>{resp}</li>
						))}
					</ul>
				</div>
			))}
		</section>
	);
};

export default Experience;
