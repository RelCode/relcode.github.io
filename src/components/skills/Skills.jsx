import { useState, useEffect } from 'react';
import './skills.css'

const Skills = () => {
    const [aboutHeight, setAboutHeight] = useState(0)

    const style = {
        'height': 'calc(100% - ' + aboutHeight + 'px)'
    }

    useEffect(() => {
        setAboutHeight(document.getElementById('about').clientHeight)
    }, [])
    return (
        <>
            <div className="container-fluid" id="skills">
                <h2 className="section-title">Skills</h2>
                <div className="row">
                    <div className="col-xs-12 col-md-6 skills-col" data-aos="zoom-in">
                        <div className="soft-skills">
                            <ul className="skills-list m-0 p-0">
                                <li className="progress">
                                    <i>Self-Driven</i>
                                    <span className="progress-bar" role="progressbar" style={{ width: " 100%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">100%</span>
                                </li>
                                <li className="progress">
                                    <i>Problem Solving</i>
                                    <span className="progress-bar" role="progressbar" style={{ width: " 87%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">87%</span>
                                </li>
                                <li className="progress">
                                    <i>Listening</i>
                                    <span className="progress-bar" role="progressbar" style={{ width: " 85%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">85%</span>
                                </li>
                                <li className="progress">
                                    <i>Communication</i>
                                    <span className="progress-bar" role="progressbar" style={{ width: " 80%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">80%</span>
                                </li>
                                <li className="progress">
                                    <i>Time Management</i>
                                    <span className="progress-bar" role="progressbar" style={{ width: " 80%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">80%</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 skills-col" data-aos="zoom-in">
                        <div className="hard-skills">
                            <ul className="m-0 p-0">
                                <li className="hard-skills-list">
                                    <li className="progress">
                                        <i>HTML</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 87%" }} aria-valuenow="87" aria-valuemin="0" aria-valuemax="100">87%</span>
                                    </li>
                                    <li className="progress">
                                        <i>CSS</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 84%" }} aria-valuenow="84" aria-valuemin="0" aria-valuemax="100">84%</span>
                                    </li>
                                </li>
                                <li className="hard-skills-list">
                                    <li className="progress">
                                        <i>JavaScript</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 85%" }} aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">85%</span>
                                    </li>
                                    <li className="progress">
                                        <i>PHP</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 82%" }} aria-valuenow="82" aria-valuemin="0" aria-valuemax="100">82%</span>
                                    </li>
                                </li>
                                <li className="hard-skills-list">
                                    <li className="progress">
                                        <i>React</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 79%" }} aria-valuenow="79" aria-valuemin="0" aria-valuemax="100">79%</span>
                                    </li>
                                    <li className="progress">
                                        <i>Angular</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 68%" }} aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">68%</span>
                                    </li>
                                </li>
                                <li className="hard-skills-list">
                                    <li className="progress">
                                        <i>C#</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 70%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">70%</span>
                                    </li>
                                    <li className="progress">
                                        <i>Python</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 55%" }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100">55%</span>
                                    </li>
                                </li>
                                <li className="hard-skills-list">
                                    <li className="progress">
                                        <i>MS SQL</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 80%" }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">80%</span>
                                    </li>
                                    <li className="progress">
                                        <i>MySQL</i>
                                        <span className="progress-bar" role="progressbar" style={{ width: " 87%" }} aria-valuenow="87" aria-valuemin="0" aria-valuemax="100">87%</span>
                                    </li>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="skills-buffer" style={style}>

            </div>
        </>
    )
}

export default Skills