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
				"Built and maintained frontend features for legal professionals platform using React and TypeScript",
				"Integrated AI capabilities with Azure OpenAI, developing LLM evaluation, regression testing tools, and RAG project in Python with most of our UI components in Angular",
				"Optimized components for maximum performance, also performed code reviews and mentored a junior developer while being mentored by a senior engineer",
                "I'm always looking into finding ways to improve our retrieval implementation and answer generation processes to enhance user experience",
                "I've hosted knowledge sharing sessions on LLMs and best practices for integrating AI into applications",
                "From time to time, I collaborate with CloudOps team to setup IAAC templates whether it's to create DBs, S3 buckets, or other infrastructure needs",
                "Currently working towards 80% test coverage both our Angular and Python codebases",
			],
		},
		{
			title: "Software Engineer I",
			company: "Eezipay",
			location: "Technopark, Stellenbosch",
			period: "Oct 2022 - Jun 2024",
			responsibilities: [
				"Developed full-stack applications using React, Node.js, and PHP in an Agile environment",
				"Spearheaded Nedbank integration project and created holiday management microservice",
				"Built similarity search feature using Levenstein algorithm and custom tooltips library based on Chariot-Tooltips",
				"Achieved 90% test coverage through comprehensive unit and integration testing",
			],
		},
		{
			title: "Junior System Automator",
			company: "Prolific Technologies",
			location: "Jet Park, Kempton Park",
			period: "Dec 2019 - Sept 2022",
			responsibilities: [
				"Designed web applications and databases to collect, analyze, and visualize production machine data",
				"Automated data collection processes and created dynamic reports for stakeholders",
				"Setup and maintained servers, network infrastructure, and client websites",
			],
		},
		{
			title: "Web Developer, Intern",
			company: "Abangani Media",
			location: "Braamfontein, Johannesburg",
			period: "Jul 2017 - Jul 2019",
			responsibilities: [
				"Built responsive web interfaces using HTML, CSS, and JavaScript",
				"Maintained legacy codebases and participated in Agile ceremonies",
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
