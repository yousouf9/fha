import React from 'react';
import { Form, Row, Col } from 'react-bootstrap'


const LandForm = (props) => {


    const getSelectedValue = (event, name)=>{

        props.onChange(event, name)
    } 
    const renderStates = () =>(
        props.getStates?
         props.getStates.result.map((item, i)=>(
            <option key={i} value={item.state} >{item.state}</option>
         ))
        :null
    )

    const renderCities = () =>(
        props.getStateCities?
         props.getStateCities.result.lgas.map((item, i)=>(
            <option key={i} value={item} >{item}</option>
         ))
        :null
    )

    
    return (
        <div className="animate__animated animate__bounceInRight">
            <Form.Row>
                <Form.Group  className="col-md-5 col-sm-12" >
                    <Form.Label>Choose Your Preferred Location</Form.Label>
                    <Form.Control as="select"  size="sm" onChange={(event)=> getSelectedValue(event, "state")}>
                    <option>--Select your State</option>
                    {renderStates()}
                </Form.Control>
                </Form.Group>

                <Form.Group  className="col-md-5 col-sm-12 pt-md-2">
                <Form.Label></Form.Label>
                <Form.Control as="select" size="sm"  onChange={(event)=> getSelectedValue(event, "lga")}>
                    <option>--Select your LGA</option>
                    {renderCities()}
                </Form.Control>
                </Form.Group>

                <Form.Group  className="col-md-2 col-sm-12 pt-md-2">
                <Form.Label></Form.Label>
                <Form.Control type="number" size="sm" placeholder="Radius"   onChange={(event)=> getSelectedValue(event, "radius")}/>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group  className="col-md-4 col-sm-12" >
                    <Form.Label>Type of land</Form.Label>
                    <Form.Control as="select"  size="sm" onChange={(event)=> getSelectedValue(event, "landType")}>
                    <option>Purpose</option>
                    <option defaultValue="purpose 1">Purpose 1</option>
                    <option value="purpose 2">Purpose 2</option>
                    <option value="purpose 3">Purpose 3</option>
                    <option value="purpose 4">Purpose 4</option>
                    <option value="purpose 5">Purpose 5</option>
                </Form.Control>
                </Form.Group>

            </Form.Row>
            <Form.Row>
                <Form.Group  className="col-md-4 col-sm-12">
                    <Form.Label>Land Size (Square Meters)</Form.Label>
                    <Form.Control as="select"  size="sm" onChange={(event)=> getSelectedValue(event, "sizeMin")}>
                    <option>From</option>
                    <option defaultValue="1000">1000</option>
                    <option value="2000">2000</option>
                    <option value="3000">3000</option>
                    <option value="4000">4000</option>
                    <option value="5000">5000</option>
                </Form.Control>
                </Form.Group>

                <Form.Group  className="col-md-4 col-sm-12 pt-md-2">
                <Form.Label></Form.Label>
                <Form.Control as="select"  size="sm" onChange={(event)=> getSelectedValue(event, "sizeMax")}>
                    <option>TO</option>
                    <option defaultValue="2000">2000</option>
                    <option value="3000">3000</option>
                    <option value="4000">4000</option>
                    <option value="5000">5000</option>
                    <option value="6000">6000</option>
 
                </Form.Control>
                </Form.Group>

            </Form.Row>  
            <Form.Row>
                <Form.Group className="col-md-4 col-sm-12">
                    <Form.Label>Price Range</Form.Label>
                    <Form.Control as="select"  size="sm" onChange={(event)=> getSelectedValue(event, "priceMin")}>
                    <option>Minimum price</option>
                    <option defaultValue="100000">100,000</option>
                    <option value="200000">200,000</option>
                    <option value="300000">300,000</option>
                    <option value="400000">400,000</option>
                    <option value="500000">500,000</option>
                </Form.Control>
                </Form.Group>

                <Form.Group  className="col-md-4 col-sm-12 pt-md-2">
                <Form.Label></Form.Label>
                <Form.Control as="select"  size="sm" onChange={(event)=> getSelectedValue(event, "priceMax")}>
                    <option>Maximum price</option>
                    <option defaultValue="200000">200,000</option>
                    <option value="300000">300,000</option>
                    <option value="400000">400,000</option>
                    <option value="500000">500,000</option>
                    <option value="600000">600,000</option>
 
                </Form.Control>
                </Form.Group>
            </Form.Row>
            
        </div>
    );
};

export default LandForm;