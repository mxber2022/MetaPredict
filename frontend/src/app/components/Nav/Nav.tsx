"use client"
import "./Nav.css";

function Nav() {
    return(
        <nav className="nav">
            <div className="nav__container">
                <div className="nav__left">
                    <div className="nav__logo">
                        VERIDICT
                        {/* <img src="" alt="" /> */}
                    </div>
                    <div className="nav__search">
                        <input type="text" typeof="search" placeholder="Search markets ..." />
                    </div>
                </div>
                <div className="nav__right">
                    <w3m-button />
                </div>
            </div>
        </nav>
    )
}

export default Nav;
