import React from 'react';
import { Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCube, faMapMarker, faHome} from '@fortawesome/free-solid-svg-icons';

const Assets = () => {
    return (
         <Container className="shadow-sm p-5 mb-5 bg-white rounded">
               <div className="text-center text-mutted">
                    <h5><FontAwesomeIcon icon={faCube} size="lg"/> Create / Remove Asset</h5>
               </div>
             <div className="row text-center p-5 bg-info">
                 <div className="col-md-4 ">
                      <p><Link to="/admin/view/estate" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'20px',
                          color:'#e3e3e3'
                      }}>
                       <FontAwesomeIcon icon={faCube} size="lg"/> View All Estates
                      </Link></p>
                 </div>
                 <div className="col-md-4">
                    <p><Link to="/admin/add/estate" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'20px',
                          color:'#e3e3e3'
                      }}>
                        <FontAwesomeIcon icon={faCube} size="lg"/> Create New Estate</Link></p>
                 </div>
                 <div className="col-md-4">
                 <p><Link to="/admin/remove/estate" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'20px',
                          color:'#e3e3e3'
                      }}> <FontAwesomeIcon icon={faCube} size="lg"/> Remove an Estate</Link></p>
                 </div>
             </div>

             
             <div className="row pt-3">
                 <div className="col-md-6 text-left border-right bg-warning p-2">
                        <div className="p-1"><p> <Link to="/admin/view/properties" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'15px',
                          color:'#3E3E3E'
                      }}><FontAwesomeIcon icon={faHome} size="lg"/> View All Properties</Link></p></div>
                        <div className="p-1"><p><Link to="/admin/add/property" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'15px',
                          color:'#3E3E3E'
                      }}> <FontAwesomeIcon icon={faHome} size="lg"/>Add a Property</Link></p></div>
                        <div className="p-1"><p><Link to="/admin/remove/property" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'15px',
                          color:'#3E3E3E'
                      }}> <FontAwesomeIcon icon={faHome} size="lg"/>Remove a Property</Link></p></div>
                 </div>
               
                 <div className="col-md-6 text-left bg-success p-2">
                        <div  className="p-1"><p><Link to="/admin/view/plots" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'15px',
                          color:'#3E3E3E'
                      }}> <FontAwesomeIcon icon={faMapMarker} size="lg"/>View All Plots</Link></p></div>
                        <div  className="p-1"><p><Link to="/admin/add/plot" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'15px',
                          color:'#3E3E3E'
                      }}> <FontAwesomeIcon icon={faMapMarker} size="lg"/>Add a Plot</Link></p></div>
                        <div  className="p-1"><p><Link to="/admin/remove/plot" style={{
                          textDecoration:'none',
                          fontWeight:'400',
                          fontSize:'15px',
                          color:'#3E3E3E'
                      }}> <FontAwesomeIcon icon={faMapMarker} size="lg"/>Remove a Plot (s)</Link></p></div>
                     
                </div>
             </div>
         </Container>
    );
};

export default Assets;