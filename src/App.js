import {Navbar, Header, About, Skills, Portfolio, Contact, Footer} from './components';
import {useState,useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
    const [navHeight, setNavHeight] = useState(0)

    const getNavHeight = () => {
        setNavHeight(document.getElementsByClassName('navbar')[0].clientHeight)
    }

    useEffect(() => {
        getNavHeight()
        AOS.init()
        AOS.refresh()
    })

    return (
        <>
            <div className='header'>
                <Navbar/>
                <Header navHeight={navHeight}/>
            </div>
            <About/>
            <Skills/>
            <Portfolio/>
            <Contact/>
            <Footer/>
        </>
    )
}

export default App;