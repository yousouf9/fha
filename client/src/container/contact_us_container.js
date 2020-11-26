import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons'
import {connect} from 'react-redux';
import 'animate.css';
import {Container} from 'react-bootstrap';
import {contact_us} from '../Actions'
import FormField from '../widgets/Forms/form';
import styles from '../widgets/Forms/index.module.css'
import _ from 'lodash';

class Contact_us_container extends Component {
     constructor(props){
          super(props)
        this.state = {

            messageError:'',
            loading: false,
            formdata:{
                name:{
                    element:'input',
                    value:'',
                    config:{
                        name:'name_input',
                        type: 'text',
                        placeholder:'Your Name'
                    },
                    validation:{
                        required: true,
                        name: true,
                    },
                    valid: false,
                    touched: false,
                    validationMessage:''
                },
                email:{
                    element:'input',
                    value:'',
                    config:{
                        name:'email_input',
                        type: 'email',
                        placeholder:'Your email'
                    },
                    validation:{
                        required: true,
                        email: true
                    },
                    valid: false,
                    touched: false,
                    validationMessage:''
                },
                subject:{
                    element:'input',
                    value:'',
                    config:{
                        name:'subject_input',
                        type: 'text',
                        placeholder:'Message Subject'
                    },
                    validation:{
                        required: true,
                        subject: true,
                    
                    },
                    valid: false,
                    touched: false,
                    validationMessage:''
                },
                message:{
                    element:'textarea',
                    value:'',
                    config:{
                        name:'message_input',
                        placeholder:'Type Message'
                    },
                    validation:{
                        required: true,
                        message: true,
                       
                    },
                    valid: false,
                    touched: false,
                    validationMessage:''
                },
               
            }
      }
    
    
    
    }


   
    

  updateForm =(element)=>{
    let newFormData = { ...this.state.formdata  }
    let newElement = { ...newFormData[element.id] }
     
    newElement.value = element.event.target.value;

    if(element.blur){
        let validateData = this.validate(newElement);
         
       
        newElement.valid= validateData[0];
        newElement.validationMessage = validateData[1];

        console.log(newElement)

    }

    newElement.touched = element.blur;
    newFormData[element.id] = newElement;
    
    this.setState({
      formdata: newFormData
    })
 
  
  }

  validate = (element)=>{
      let error = [true, ''];


      if(element.validation.email){

          const valid = this.validateEmail(element.value)
          const message = `${!valid ? 'Invalid email address': ''}`
          error = !valid? [valid, message]: error;
      }

      if(element.validation.password){

          const valid = element.value.length >= 5;
          const message = `${!valid ? 'Must be equal to or greater than 5 chars': ''}`
          error = !valid ? [valid, message]: error;
      } 

      if(element.validation.name){

        const valid = element.value.length > 3;
        const message = `${!valid ? 'Please provide a valid name': ''}`
        error = !valid ? [valid, message]: error;
    }
    if(element.validation.subject){

        const valid = element.value.length > 3;
        const message = `${!valid ? 'subject is too short': ''}`
        error = !valid ? [valid, message]: error;
    }
    if(element.validation.subject){

        const valid = element.value.length > 3;
        const message = `${!valid ? 'Message body to short': ''}`
        error = !valid ? [valid, message]: error;
    }

      if(element.validation.required){

          const valid = element.value.trim() !== '';
          const message = `${!valid ? 'This field is required': ''}`
          error = !valid? [valid, message]: error;
      }

      if(element.value !== ''){

        element.touched = true  
    }

      return error;
  }
  validateEmail = (email)=>{
  const verify = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return verify.test(String(email).toLowerCase());
  } 

  submitForm =(event)=>{

      event.preventDefault();
      
          let dataToSubmit = {};
          let formIsvalid = true;

          for(let key in this.state.formdata){
              dataToSubmit[key]=this.state.formdata[key].value;
          }

          for(let key in this.state.formdata){
              formIsvalid = this.state.formdata[key].valid && formIsvalid;
          }

          if(formIsvalid){

              this.setState({
                  loading:true,
                  registerError:''
              })

              this.props.contact_us(dataToSubmit);

              console.log(this.props);

          }else{
            console.log(dataToSubmit , formIsvalid);
            this.setState({
                  loading:false,
                   registerError:'Please fill in the contact form correctly'
              })
          }
                      
                
             
 }


   submitButtun = ()=>{
      return (
          this.state.loading ?
          'Message sending...'
          :
          <div>
              <button onClick={(event)=> this.submitForm(event)}>Submit <FontAwesomeIcon icon={faArrowAltCircleRight} color="#FFFFFF"/> </button>
          </div>
      )
  } 
  showError = ()=>{

      
      return (
          
      this.state.registerError !== ''?
      <div className={styles.labelError}>{this.state.registerError} </div>
      :
      ''
      )

  }
  render(){
      return (

        <Container className="header-wrapper">
          <div className={`animate__animated animate__fadeInUp shadow-sm p-3 mb-5 bg-white rounded ${styles.formContainer}`}>
              <form onSubmit={(event)=> this.submitForm(event)} >
                  <h2>CONTACT US</h2>
                  <p>Animate.css is a for use in your web projects.
                       Great for emphasis, home pages, sliders, and attention-guiding hints.</p>
                  <FormField  
                      id='name'
                      formdata={this.state.formdata.name}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='subject'
                      formdata={this.state.formdata.subject}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='email'
                      formdata={this.state.formdata.email}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='message'
                      formdata={this.state.formdata.message}
                      change={(element)=> this.updateForm(element)}

                  />
                {this.submitButtun()}
                {this.showError()}
              </form>
          </div>
        </Container>
      );
  }

}
const mapStateToProps = (state) => {

    return {
        contacts: state.contacts
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        contact_us
    }, dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps )(Contact_us_container);