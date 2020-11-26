import React, { PureComponent } from 'react';
import {Container} from  'react-bootstrap';
import {connect} from  'react-redux';
import {bindActionCreators} from  'redux';
import {getAllEstate, clearEstate, getEstate, createPlot, clearPlot} from '../../../Actions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome, faSave} from '@fortawesome/free-solid-svg-icons'
import FormField from '../../../widgets/Forms/form';
import styles from '../../../widgets/Forms/index.module.css'
import {toast} from 'react-toastify'


class AddPlot extends PureComponent {
    
     constructor(props){
        super(props)
      this.state = {

          messageError:'',
          loading: false,
          formdata:{
              estate_name:{
                  element:'select-estate_name',
                  value:'',
                  config:{
                    name:'estate_name_input',
                    options:[]
                },
                  validation:{
                      required: true,
                      estate_name: true,
                  
                  },
                  valid: false,
                  touched: false,
                  validationMessage:''
              },
              plotType:{
                element:'select-plotType',
                value:'',
                config:{
                  name:'plotType_input',
                  options:[]
              },
                validation:{
                    required: true,
                    plotType: true,
                
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            estate_state:{
                element:'input',
                value:'',
                config:{
                    disabled: true,
                    name:'estate_state_input',
                    type: 'text',
                    placeholder:'State'
                },
                validation:{
                    required: true,
                    estate_state:true
                 
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            estate_lga:{
                element:'input',
                value:'',
                config:{
                    disabled:true,
                    name:'estate_lga_input',
                    type: 'text',
                    placeholder:'Lga'
                },
                validation:{
                    required: true,
                    estate_lga:true
                 
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            size:{
                element:'input',
                value:'',
                config:{
                    name:'size_input',
                    type: 'number',
                    placeholder:'land size'
                },
                validation:{
                    required: true,
                    size:true
                 
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            price:{
                element:'input',
                value:'',
                config:{
                    name:'price_input',
                    type: 'number',
                    placeholder:'Price'
                },
                validation:{
                    required: true,
                    price:true
                 
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


        }

        newElement.touched = element.blur;
        newFormData[element.id] = newElement;

          
        if(element.id === "estate_name"){
            if(newElement.value !== "-- Select Estate --"){
                 this.props.getEstate(newElement.value)
            }
        }
    
        
        this.setState({
        formdata: newFormData
        })

      
      
    }
   
    validate = (element)=>{
        let error = [true, ''];
  
  
        if(element.validation.estateID){
  
            const valid = element.value.length >= 6;
            const message = `${!valid ? 'Estate ID not value must be 6 chars or more': ''}`
            error = !valid? [valid, message]: error;
        }
  
        if(element.validation.name){
  
            const valid = element.value.length >= 3;
            const message = `${!valid ? 'Please provide a valid name': ''}`
            error = !valid ? [valid, message]: error;
        } 
  
        if(element.validation.state){
  
          const valid = element.value !== "-- State --";
          const message = `${!valid ? 'Please select a state': ''}`
          error = !valid ? [valid, message]: error;
      }
      if(element.validation.lga){
  
        const valid = element.value !== "-- LGA --";
          const message = `${!valid ? 'Select a LGA': ''}`
          error = !valid ? [valid, message]: error;
      }
      if(element.validation.address){
  
          const valid = element.value.length > 3;
          const message = `${!valid ? 'Provide a valide area': ''}`
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

            if(dataToSubmit.estate_state.length > 0 && dataToSubmit.estate_lga.length > 0){
                formIsvalid = true
            }
  
            if(formIsvalid){
  
                this.setState({
                    loading:true,
                    registerError:''
                })
  
                this.props.createPlot({
                    estate: dataToSubmit.estate_name,
                    size:dataToSubmit.size,
                    plotType:dataToSubmit.plotType,
                    estate_state:dataToSubmit.estate_state,
                    estate_lga: dataToSubmit.estate_lga,
                    price:dataToSubmit.price
                });
  
                console.log(this.props);
  
            }else{
              console.log(dataToSubmit , formIsvalid);
              this.setState({
                    loading:false,
                     registerError:'Please fill in the contact form correctly'
                })
            }
                        
                  
               
   }


   static getDerivedStateFromProps(nextProps, prevState){
                        console.log(nextProps)
    if(nextProps.plot.createPlot){

        if(nextProps.plot.createPlot.success){
            toast.success("Estate Successfully created") 
            nextProps.history.push('/admin/view/estate')
            return {
          
                loading:false,
                
                 
              }
        } 
        


        if(nextProps.plot.createPlot.response){
            if(nextProps.plot.createPlot.response.status === 400){
                console.log("previous state",prevState);
                console.log("previous props", nextProps);
         if(nextProps.plot.createPlot.response.data.error){
            toast.error(nextProps.plot.createPlot.response.data.error)
             toast.error(nextProps.plot.createPlot.response.data.message)  
              nextProps.clearPlot()
             return {
                    loading:false,
                      
                     prevState
                     }
         }else{
             toast.error(nextProps.plot.createPlot.response.data.error) 
             nextProps.clearPlot() 
             return{
                 loading:false,
                 prevState
              }
         }
     
   }
        }
        

    }

       
        
        
    if(nextProps.estates.getAllEstate){

        if(nextProps.estates.getAllEstate.result !== prevState.formdata.estate_name.config.options){
            return{
                formdata:{
                      ...prevState.formdata,
                      estate_name:{
                        ...prevState.formdata.estate_name,
                        config:{
                            ...prevState.formdata.estate_name.config,
                            options:nextProps.estates.getAllEstate.result
                        }
                    }
                }
            }
            
          }
    }

    if(nextProps.estates.getEstate){

        if(nextProps.estates.getEstate.result.state !== prevState.formdata.estate_state){
            return{
                formdata:{
                      ...prevState.formdata,
                      estate_state:{
                        ...prevState.formdata.estate_state,
                        value:nextProps.estates.getEstate.result.state
                        
                    },
                    estate_lga:{
                        ...prevState.formdata.estate_lga,
                        value:nextProps.estates.getEstate.result.lga
                        
                    }
                }
            }
            
          }
    }

    

 
  return null  
}
  

    componentWillUnmount(){
        this.props.clearPlot();
        this.props.clearEstate();
    }
    submitButtun = ()=>{
        return (
            this.state.loading ?
            'Creating Esate...'
            :
            <div>
                <button onClick={(event)=> this.submitForm(event)}><FontAwesomeIcon icon={faSave} color="#FFFFFF"/>  Save and continue </button>
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

    componentDidMount(){
     //Set the start, limit, and order here initial of 0, 100 and ASC is set at the action


    this.props.getAllEstate();

    let newFormData = { ...this.state.formdata  }
    let newElement = { ...newFormData["plotType"] }
    
    newElement.config.options= ['Residential', 'Commercial'];

    

   
    }
    render() {
       
        return (
            <Container className="p-3 text-center text-mutted">
                 <p className="pt-3"><FontAwesomeIcon icon={faHome} size="lg"/> Create New Plot</p>
                 <div className={`animate__animated animate__fadeInUp shadow-sm p-3 mb-5 bg-white rounded ${styles.formContainer}`}>
                <form onSubmit={(event)=> this.submitForm(event)} >
                  <FormField  
                      id='estate_name'
                      formdata={this.state.formdata.estate_name}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='plotType'
                      formdata={this.state.formdata.plotType}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='estate_state'
                      formdata={this.state.formdata.estate_state}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='estate_lga'
                      formdata={this.state.formdata.estate_lga}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='size'
                      formdata={this.state.formdata.size}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='price'
                      formdata={this.state.formdata.price}
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
    //console.log("from state", state);
    return {
        estates: state.estates,
        plot:state.plot
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
       getAllEstate,
       createPlot,
       clearPlot,
       clearEstate,
       getEstate
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPlot);