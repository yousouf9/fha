import React from 'react';
import {Container} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import Header from '../../../components/administrator/Header/header'
import SideBar from '../../../components/administrator/SideBar/sidebar'


const Layout = (props) => {

    return (
       
                <div className="header-wrapper">
                <Container>
                    <div className="admin_container">
                        
                    <div className="sideBar px-0 col-12 col-md-3 col-lg-2">
                        <SideBar {...props} />
                    </div>
                    <div className="main_content p-0 col-sm-12 col-md-9 offset-md-3 border-bottom col-lg-10 offset-lg-2" >
                        <div className="p-0 container-fluid">
                            <Header  {...props}/>
                            {props.children}
                        </div>
                    </div>
                    </div>
                </Container>
            </div>
         
    )
}

export default Layout;