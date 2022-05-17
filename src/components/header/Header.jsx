import Typed from 'typed.js';
import {useState,useEffect,useRef} from 'react'
import './header.css';

const Header = ({navHeight}) => {
    const typie = useRef(null)

    useEffect(() => {
        const typed = new Typed(typie.current, {
            strings: ['Web Developer','Software Developer','Web App Developer','E-Commerce'],
            startDelay: 2000,
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 100,
            showCursor: false,
            loop: true,
            cursorChar: '|'
        })

        return () => {
            typed.destroy()
        };
    },[])
    return (
        <div className="container-fluid" id="header">
            <div className='row'>
                <div className='col col-xs-12'>
                    <div className='header-effect'>
                        <h2 className='name-typing-effect'><span>Relebohile</span> <span>Nkosi</span></h2>
                        <span>
                            <h4 ref={typie}></h4>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header