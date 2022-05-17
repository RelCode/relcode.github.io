import {useState, useEffect} from 'react';
import emailjs from '@emailjs/browser';
import swal from 'sweetalert';
import './contact.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Contact = () => {
    const [contactHeight, setContactHeight] = useState(0)

    const style = {
        'height': 'calc(100% - ' + contactHeight + 'px)'
    }

    useEffect(() => {
        setContactHeight(document.getElementById('contact').clientHeight)
    }, [])
    const [names,setNames] = useState(null)
    const [contacts, setContacts] = useState(null)
    const [message,setMessage] = useState('')

    const service_id = process.env.REACT_APP_EMAILJS_SERVICE
    const template_id = process.env.REACT_APP_EMAILJS_TEMPLATE
    const public_key = process.env.REACT_APP_EMAILJS_PUBLIC

    const handleContactSubmit = (e) => {
        e.preventDefault()
        if(!names || !contacts){
            swal({
                title: 'Error',
                text : 'Please Provide Name & Contact Details',
                icon: 'warning'
            })
        }else{
            emailjs.sendForm(service_id, template_id, e.target, public_key)
            .then((results) => {
                document.getElementById('names').value = '';
                document.getElementById('contact').value = '';
                document.getElementById('message').value = '';
                swal({
                    title: 'Thank You',
                    text: 'A Message Has Been Sent',
                    icon: 'success'
                })
            }, (error) => {
                swal({
                    title: 'Sorry',
                    text: 'An Error Occured, Please Try Again',
                    icon: 'error'
                })
            })
        }
    }
    return (
        <>
            <div className="container-fluid" id="contact" data-aos="zoom-in">
                <h4 className="section-title">Contact Me</h4>
                <form onSubmit={(e) => handleContactSubmit(e)}>
                    <div className="row">
                        <div className="col-xs-12 col-md-4 offset-md-2 contact-input">
                            <label htmlFor="names">Name</label>
                            <input type="text" name="names" className="form-control" id="names" autoComplete="off" onChange={(e) => setNames(e.target.value)} />
                        </div>
                        <div className="col-xs-12  col-md-4">
                            <label htmlFor="contact">Contact Info</label>
                            <input type="text" name="contacts" className="form-control" id="contact" autoComplete="off" onChange={(e) => setContacts(e.target.value)} placeholder="(Email Address/Contact Number)" />
                        </div>
                        <div className="col-xs-12 col-md-8 offset-md-2">
                            <label htmlFor="message">Message</label>
                            <textarea name="message" className="form-control" rows={5} id="message" placeholder="(Optional)" onChange={(e) => setMessage(e.target.value)}>

                            </textarea>
                        </div>
                        <div className="col-xs-12 col-md-8 offset-md-2 contact-bottom">
                            <div className="row">
                                <div className="col-xs-12 col-md-4">
                                    <button className="btn btn-primary form-control">Send</button>
                                </div>
                                <div className="col-xs-12 col-md-4 d-flex justify-content-center icon-buffer"><strong>OR</strong></div>
                                <div className="col-xs-12 col-md-4 app-icons">
                                    <a href="https://wa.me/+27624171162" target="_blank" rel="noreferrer"><WhatsAppIcon /></a>
                                    <a href="https://www.linkedin.com/in/relebohile-nkosi-792b99106" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
                                    <a href="https://www.github.com/RelCode" target="_blank" rel="noreferrer"><GitHubIcon /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="contact-buffer" style={style}>

            </div>
        </>
    )
}

export default Contact