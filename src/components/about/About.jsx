import {useState,useEffect} from 'react';
import './about.css';
import fana from '../../assets/images/fana.jpg';

const About = () => {
    const [aboutHeight,setAboutHeight] = useState(0)

    const style = {
        'height':'calc(100% - '+aboutHeight+'px)'
    }

    useEffect(() => {
        setAboutHeight(document.getElementById('about').clientHeight)
    },[])

    return (
        <>
            <div className="container-fluid" id="about">
                <h2 className="section-title">About Me</h2>
                <div className="row">
                    <div className="cols col-xs-12 col-md-6" data-aos="zoom-in">
                        <div className="cols-col row about-user">
                            <div className="col-xs-12 col-md-6">
                                <img src={fana} className="user-image" alt="RJ Nkosi" width="100%"/>
                            </div>
                            <div className="col-xs-12 col-md-6 about-user-info">
                                <span>Name: <strong>Relebohile Nkosi</strong></span>
                                <span>Profile: <strong>Full Stack Developer</strong></span>
                                <span>Email: <strong>Princefana7@gmail.com</strong></span>
                                <span>Contact Number: <strong>062 417 1162</strong></span>
                                <span>Qualification: <strong>National Diploma</strong></span>
                                <span>Institution: <strong>University of Johannesburg</strong></span>
                                <span>Completion Year: <strong>2019</strong></span>
                            </div>
                        </div>
                    </div>
                    <div className="cols col-xs-12 col-md-6" data-aos="zoom-in">
                        <div className="cols-col row about-user-summary" >
                            <blockquote>Innovative tech fanatic with more than 5years of experience working as a programmer. Capable of working with a variety of technology and software solutions, and managing databases as well as software/hardware installation and maintenance. Valuable team member who has experience diagnosing problems and developing solutions. Moderate expertise in networking systems and working with mainframe computers. Talented individual with unique ideas and a history of successful contributions in the field and an unquenchable thirst for knowledge & growth.</blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About