import React, { Component } from 'react';
import {Container, Form, Button} from 'react-bootstrap'
import  SalesForm from '../widgets/salesForm';
import LandForm from '../widgets/landForm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import 'animate.css';
import {advancedSearchProperty, getAllStates, getAllStateCities } from '../Actions'

class Property_container extends Component {
     constructor(props){
         super(props)

         this.state = {
            showSalesform:{
                show:false,
                active:'showSales',
                currentClass:''
            },
            showlandForm:{
                show:false,
                active:'hideLand',
                currentClass:''
            },
            formData:{
                state:'',
                lga:'',
                radius:'',
                propertyType:'',
                sizeMin:'',
                sizeMax:'',
                priceMin:'',
                priceMax:'',
                name:'',
                bedrooms:'',
                bathrooms:'',
                landType:''

            }
          }
          props.getAllStates()

         
     }

   

    showSaleForm =()=>{

        this.setState({
            showSalesform:{
               active:'showSales',
               show:true,
               currentClass:'sales'
            },
            showlandForm:{
                active:'hideLand',
                show:false,
                currentClass:'landGrey'
             }

        })
        
    }

    showlandForm = ()=>{
        this.setState({
            showSalesform:{
               active:'hideSales',
               show:true,
               currentClass:'salesGrey'
            },
            showlandForm:{
                active:'showLand',
                show:true,
                currentClass:'land'
             }

        })
    }

    submitSalesSearch =(event)=>{
        event.preventDefault()

   

        this.props.advancedSearchProperty(this.state.formData)

        console.log("After submitting", this.props);




    }

    
    submitLandSearch =(event)=>{
        event.preventDefault()

        console.log(this.state.formData);


    }

    handlInputChange=(event, name)=>{

        let newFormData = this.state.formData;

        if(name === "state"){
            if(event.target.value !== "--Select your State"){
                this.props.getAllStateCities(event.target.value);
                newFormData.state = event.target.value;
            }
          
        }

        if(name === "lga"){
            newFormData.lga = event.target.value;
        }
        if(name === "radius"){
            newFormData.radius = event.target.value;
        }
        if(name === "propertyType"){
            newFormData.propertyType = event.target.value;
        }
        if(name === "sizeMin"){
            newFormData.sizeMin = event.target.value;
        }
        if(name === "sizeMax"){
            newFormData.sizeMax = event.target.value;
        }
        if(name === "priceMin"){
            newFormData.priceMin = event.target.value;
        }
        if(name === "priceMax"){
            newFormData.priceMax = event.target.value;
        }
        if(name === "name"){
            newFormData.name = event.target.value;
        }
        if(name === "bedrooms"){
            newFormData.bedrooms = event.target.value;
        }
        if(name === "bathrooms"){
            newFormData.bathrooms = event.target.value;
        }
        if(name === "landType"){
        newFormData.landType = event.target.value;
        }
       
        this.setState({

            ...newFormData
        })
    }
    render() {
        return (
            <div className="header-wrapper ">
                 <Container className= "animate__animated animate__backInUp animate__delay-1s border border-white shadow-lg bg-white rounded py-4">
                        <div className="d-flex ">
                                <div className={`bg-success flex-fill text-center text-white p-2 ${this.state.showSalesform.currentClass}`} onClick={this.showSaleForm}  >Sales</div>
                                <div className={`bg-success flex-fill text-center text-white p-2 ${this.state.showlandForm.currentClass}`}  onClick={this.showlandForm} >Land</div>
                        </div> 
                         <Form onSubmit={this.submitSalesSearch} className={`pt-3 ${this.state.showSalesform.active}`}>
                            <SalesForm {...this.props.states} onChange={(event, name)=>this.handlInputChange(event, name)}/>
                           <button type="submit" className="btn btn-block btn-outline-success">Search</button>
                        </Form>
                        <Form onSubmit={this.submitLandSearch}  className={`pt-3 ${this.state.showlandForm.active}`}>
                            <LandForm  {...this.props.states} onChange={(event, name)=>this.handlInputChange(event, name)}/>
                           <button type="submit" className="btn btn-block btn-outline-success">Search</button>
                        </Form>
                       
                 </Container>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        properties: state.properties,
        states: state.states
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllStates,
        getAllStateCities,
        advancedSearchProperty
    
    },dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Property_container);