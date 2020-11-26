import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faSearch, faHome} from '@fortawesome/free-solid-svg-icons'
import  {Link} from 'react-router-dom';
import  SideNav_Items from './sidenav_items';

const Sidebar = (props) => {
    return (
        <div className="main-navbar">
            <nav className="align-items-stretch bg-white   flex-nowrap border-bottom p-0 py-2 pb-3 navbar navbar-light">
                <Link to="#" className="w-100 mr-0 navbar-brand "  style={{lineHeight:"25px"}}>
                    <div className="d-table m-auto">
                    <span className="d-inline-block align-top mr-1" style={{
                        maxWidth: "25px"
                    }}>
                    <FontAwesomeIcon icon ={faHome}/>
                    </span>
                    
                    <span className="d-none d-md-inline ml-1">
                            Admin
                    </span>
                    </div>
                    

                </Link>
                <Link to="#" className="toggle-sidebar d-sm-inline border-left d-md-none d-lg-none" style={{
                    width:"40px",
                    lineHeight: 3,
                    paddingLeft:'10px'
                }}>
                    <FontAwesomeIcon  icon={faArrowLeft} size="lg"/>
                </Link>
            </nav>

            <form className="main-navbar__search w-100  d-sm-flex d-md-none d-lg-none" style={{
                display:"flex",
                minHeight:"45px"
            }}>
                        
                        <div className="input-group ">
                                <div className="input-group-prepend">
                                    <span className="input-group-text header-search">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </span>
                                </div>
                                <input type="text" className="form-control shadow-none" placeholder="search" aria-label="search" />
                        </div>
            </form>

            <div className="nav-wrapper">
                <ul className="nav--no-borders flex-column nav">
                    <SideNav_Items {...props}/>
                </ul>

            </div>
            
        </div>
    );
};

export default Sidebar;