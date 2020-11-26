import React, { Component } from 'react';
import {Container, Navbar, Nav, Button, FormControl, Form} from 'react-bootstrap';
import 'animate.css';

class Header extends Component {

    constructor(props){
            super(props)

            this.state = {
                   search:""
            }
    }
    render() {
        return (
           
                 <Navbar collapseOnSelect expand="lg" className= "d-flex align-items-center animate_animated animate__pulse border-top border-bottom border-success shadow-sm bg-white rounded" fixed="top"   bg="light" variant="light" style={{
                     zIndex:1500
                 }}>
                     <Navbar.Brand href="#home"><img src='/images/logo2.png' className="img-fluid"/></Navbar.Brand>
                     <input type="text"  placeholder="Search" className="mr-sm-2" id="home_search"/>
                     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Container className="flex-grow-1">
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-5 ">
                        <Nav.Link href="/home" >Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/services">Services</Nav.Link>
                        <Nav.Link href="/properties">Properties</Nav.Link>
                        <Nav.Link href="/project">Project</Nav.Link>
                        <Nav.Link href="/gallery">Gallery</Nav.Link>
                        <Nav.Link href="/news">News</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                        <Nav.Link href="/diaspora">Diaspora City</Nav.Link>
                        </Nav>
                       
                        </Navbar.Collapse>
                       
                        
                     
                    
                        
                        </Container>
                        <input type="text"  placeholder="Search" className="mr-sm-2" id="home_search1"/>
                       
                </Navbar>
        
            
        );
    }
}

export default Header;