import './footer.css'

const Footer = () => {
    let date = new Date()
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xs-12 footer-content">
                    Designed By RJ Nkosi &copy; {date.getFullYear()}
                </div>
            </div>
        </div>
    )
}

export default Footer