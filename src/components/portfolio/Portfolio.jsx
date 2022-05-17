import {useState,useEffect} from 'react'
import isotope from 'isotope-layout';
import './portfolio.css';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ImageViewer from './ImageViewer';

//import portfolio images
import commercejs from '../../assets/images/portfolio/commercejs/main.png';
import duvha from '../../assets/images/portfolio/duvha/main.png';
import pims from '../../assets/images/portfolio/pims ms/main.png';
import prolifix from '../../assets/images/portfolio/prolifix/main.png';
import signature from '../../assets/images/portfolio/signature/main.png';
import weir from '../../assets/images/portfolio/weir/main.png';

const Portfolio = () => {
    const [visible, setVisible] = useState(false)
    const [iso, setIso] = useState(null)
    const [clicked, setClicked] = useState('')
    function isotopeFunction(){
        //.filter-parent is the parent div
        setIso(new isotope('.filter-parent', {
            itemSelector: '.filter-item',
            layoutMode: 'fitRows'
        }));
    }

    function handleFilterClick(e){
        //we select all the filter buttons (in this case, referring to clickable li elements)
        let li = document.getElementsByClassName('portfolio-items');
        for (let x = 0; x < li.length; x++) {
            li[x].classList.remove('active')
        }
        e.target.classList.add('active')
        var filterValue = e.target.dataset.filter;
        isoMagic(filterValue)
    }

    const openVisibility = (item) => {
        setVisible(true)
        setClicked(item)
    }

    function isoMagic(filterValue){
        iso.arrange({filter:filterValue})
    }
    useEffect(() => {
        isotopeFunction()
    },[])
    return (
        <div className="container-fluid" id="portfolio">
            <h2 className="section-title">Portfolio</h2>
            <div className="row">
                <span className="d-flex justify-content-center pb-5">Some Of The Projects I Enjoyed Working On</span>
                <div className="col-xs-12 filter-header">
                    <ul className="filter-list">
                        <li className="portfolio-items active" data-filter="*" onClick={(e) => handleFilterClick(e)}>All</li>
                        <li className="portfolio-items" data-filter=".websites" onClick={(e) => handleFilterClick(e)}>Websites</li>
                        <li className="portfolio-items" data-filter=".web-app" onClick={(e) => handleFilterClick(e)}>Web Apps</li>
                        <li className="portfolio-items" data-filter=".desktop" onClick={(e) => handleFilterClick(e)}>Desktop</li>
                        <li className="portfolio-items" data-filter=".commerce" onClick={(e) => handleFilterClick(e)}>Commerce</li>
                    </ul>
                </div>
            </div>
            <div className="row filter-parent">
                <div className="col-xs-12 col-md-4 filter-item commerce" data-category="desktop">
                    <img src={commercejs} onClick={() => openVisibility('commerce')} className="portfolio-image" alt="Portfolio" width="100%" height="350px"/>
                </div>
                <div className="col-xs-12 col-md-4 filter-item web-app" data-category="web-app">
                    <img src={duvha} onClick={() => openVisibility('duvha')} className="portfolio-image" alt="Portfolio" width="100%" height="350px"/>
                </div>
                <div className="col-xs-12 col-md-4 filter-item desktop" data-category="websites">
                    <img src={pims} onClick={() => openVisibility('pims')} className="portfolio-image" alt="Portfolio" width="100%" height="350px"/>
                </div>
                <div className="col-xs-12 col-md-4 filter-item websites" data-category="desktop">
                    <img src={prolifix} onClick={() => openVisibility('prolifix')} className="portfolio-image" alt="Portfolio" width="100%" height="350px" />
                </div>
                <div className="col-xs-12 col-md-4 filter-item web-app" data-category="web-app">
                    <img src={signature} onClick={() => openVisibility('signature')} className="portfolio-image" alt="Portfolio" width="100%" height="350px" />
                </div>
                <div className="col-xs-12 col-md-4 filter-item web-app" data-category="websites">
                    <img src={weir} onClick={() => openVisibility('weir')} className="portfolio-image" alt="Portfolio" width="100%" height="350px" />
                </div>
            </div>
            <ImageViewer visible={visible} setVisible={setVisible} clicked={clicked}/>
        </div>
    )
}

export default Portfolio