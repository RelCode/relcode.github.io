import branding from '../../assets/images/branding.png'
import WidgetsIcon from '@mui/icons-material/Widgets';
import './navbar.css';

const Navbar = () => {

    const handleLinkClick = (e) => {
        const elems = document.querySelectorAll('.nav-link')
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('active')
        }
        e.target.classList.add('active')
    }

    const handleMenuDisplay = () => {
        const mobileMenu = document.querySelector('.mobile-menu')
        mobileMenu.classList.remove('hide-menu-layer')
    }
    return (
        <div className="navbar navbar-light p-0" id="navbar">
            <a className="navbar-brand" href="/">
                {/* <h5><strong>Fana</strong></h5> */}
                <img src={branding} width="55px" height="55px" alt="Branding"/>
            </a>
            <WidgetsIcon className="mobile-menu-icon" onClick={() => handleMenuDisplay()}/>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link active" href="#header" onClick={(e) => handleLinkClick(e)}>Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#about" onClick={(e) => handleLinkClick(e)}>About</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#skills" onClick={(e) => handleLinkClick(e)}>Skills</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#portfolio" onClick={(e) => handleLinkClick(e)}>Porfolio</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#contact" onClick={(e) => handleLinkClick(e)}>Contact</a>
                </li>
            </ul>
        </div>
    )
}

export default Navbar