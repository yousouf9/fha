import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faSearch, faEnvelope, faBars, faUserEdit, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import  {Link} from 'react-router-dom';
import {getMessageCount, getNotificationCount, authenticateAdmin} from '../../../Actions'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {NavDropdown} from "react-bootstrap"

class Header extends Component {

    constructor(props){
        super(props)

          props.getMessageCount();
          props.getNotificationCount();
          props.authenticateAdmin();
  

    }

    renderMessages = (event)=>{
      event.preventDefault()
      this.props.history.push('/admin/messages')
    }

    renderNotifications = (event)=>{
        event.preventDefault()
        this.props.history.push('/admin/notifications')
      }
    render(){
        let messageCount = this.props.messages
        let notificationCount = this.props.notifications
        return (
            <div className="main-navbar bg-white sticky-top">
                 <div className="align-items-stretch flex-md-nowrap p-0 navbar navbar-light">
                     <form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
                        
                            <div className="input-group ">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text header-search">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control shadow-none" placeholder="search" aria-label="search" />
                            </div>
                      </form>
                            <ul className="border-left flex-row navbar-nav">
                            <li className="border-right dropdown notifications nav-item">
                                    <Link to="#" className="nav-link-icon text-center nav-link">
                                        <div className="nav-link-icon__wrapper" onClick={this.renderMessages}>
                                            <FontAwesomeIcon icon={faEnvelope}/>
                                             <span className ="badge badge-danger badge-pill counter">
                                                 {
                                                     messageCount.messageCount?
                                                         messageCount.messageCount.result
                                                    : 0
                                                 }
                                             </span>
                                        </div>
                                    </Link>

                                    <div className="dropdown-menu dropdown-menu-small collapse">

                                    </div>
                                </li>
                                <li className="border-right dropdown notifications nav-item">
                                    <Link to="#" className="nav-link-icon text-center nav-link">
                                        <div className="nav-link-icon__wrapper"  onClick={this.renderNotifications}>
                                            <FontAwesomeIcon icon={faBell}/>
                                             <span className ="badge badge-danger badge-pill counter">
                                             {
                                                  notificationCount.notificationCount?
                                                  notificationCount.notificationCount.result
                                                   : 0
                                                    
                                                 }
                                             </span>
                                        </div>
                                    </Link>

                                <div className="dropdown-menu dropdown-menu-small collapse">

                                </div>

                                </li>


                                <NavDropdown style={{
                                    paddingRight: "5px"
                                }} title={
                                       <span  aria-haspopup="true" className="text-nowrap px-2" >
                                       <img src="/images/users/passportty.png" className="user-avatar rounded-circle mr-2"/>
                                       <span className="d-none d-md-inline-block">
                                                {
                                                     this.props.admin.admin_auth?
                                                     this.props.admin.admin_auth.name.last
                                                    : ''
                                                 }
                                       </span>
                                   </span>
                                }>
                            
                                  <NavDropdown.Item href="/admin/profile"><FontAwesomeIcon icon={faUser} size="sm"/><span>Profile</span></NavDropdown.Item>
                                  <NavDropdown.Item href="/admin/edit"><FontAwesomeIcon icon={faUserEdit} size="sm"/><span>Edit Profile</span></NavDropdown.Item>
                                  <NavDropdown.Divider></NavDropdown.Divider>
                                  <NavDropdown.Item href="/admin/logout"><FontAwesomeIcon icon={faSignOutAlt} size="sm"/><span>Logout</span></NavDropdown.Item>
                                </NavDropdown>
                            </ul>
                       <nav className="nav">
                        <Link to="#" className="nav-link nav-link-icon toggle-sidebar-main d-sm-inline d-md-inline d-lg-none text-center">
                            <FontAwesomeIcon  icon={faBars} size="lg"/>
                        </Link>
                       </nav>
                 </div>
            </div>
        );
    }
   
};

const mapStateToProps = (state) => {
 
    return {
     admin:state.admin,
     messages: state.messages,
     notifications: state.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    getMessageCount,
    getNotificationCount,
    authenticateAdmin

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);