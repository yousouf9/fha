import React, { PureComponent } from 'react';
import {Container} from  'react-bootstrap';
import {connect} from  'react-redux';
import {bindActionCreators} from  'redux';
import {createEstate, getEstate, getAllStates, getAllStateCities, updateEstate, clearEstate} from '../../../Actions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCube, faSave} from '@fortawesome/free-solid-svg-icons'
import FormField from '../../../widgets/Forms/form';
import styles from '../../../widgets/Forms/index.module.css'
import {toast} from 'react-toastify'


class UpdateEstate extends PureComponent {
    
     constructor(props){
        super(props)
      this.state = {

          messageError:'',
          loading: false,
          formdata:{
              estateID:{
                  element:'input',
                  value:'',
                  config:{
                      name:'estateID_input',
                      type: 'text',
                      placeholder:'Please Enter ID'
                  },
                  validation:{
                      required: true,
                      estateID: true,
                  },
                  valid: false,
                  touched: false,
                  validationMessage:''
              },
              name:{
                  element:'input',
                  value:'',
                  config:{
                      name:'name_input',
                      type: 'text',
                      placeholder:'Estate Name'
                  },
                  validation:{
                      required: true,
                      name: true
                  },
                  valid: false,
                  touched: false,
                  validationMessage:''
              },
              state:{
                  element:'select-state',
                  value:'',
                  config:{
                    name:'state_input',
                    options:[]
                },
                  validation:{
                      required: true,
                      state: true,
                  
                  },
                  valid: false,
                  touched: false,
                  validationMessage:''
              },
              lga:{
                element:'select-lga',
                value:'',
                config:{
                  name:'lga_input',
                  options:[]
              },
                validation:{
                    required: true,
                    lga: true,
                
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            address:{
                element:'input',
                value:'',
                config:{
                    name:'area_input',
                    type: 'text',
                    placeholder:'Area'
                },
                validation:{
                    required: true,
                 
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            longitude:{
                element:'input',
                value:'',
                config:{
                    name:'longitude_input',
                    type: 'number',
                    placeholder:'Longitude'
                },
                validation:{
                    required: false,
                   
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            latitude:{
                element:'input',
                value:'',
                config:{
                    name:'latitude_input',
                    type: 'number',
                    placeholder:'Latitude'
                },
                validation:{
                    required: false,
                   
                },
                valid: false,
                touched: false,
                validationMessage:''
            },
            status:{
                value:false
            } 
          }
    
        }
 } 
  

    
    updateForm =(element)=>{
        const form = new FormData()
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

          
        if(element.id === "state"){
            if(newElement.value !== "-- State --"){
                
                this.props.getAllStateCities(newElement.value);
     
                
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

            for(let key in this.state.formdata){
                formIsvalid = this.state.formdata[key].value.length > 0 
            }
  
            if(formIsvalid){
  
                this.setState({
                    loading:true,
                    registerError:''
                })
  
                this.props.updateEstate(this.props.match.params.id, dataToSubmit);
  
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
     console.log(prevState);
    if(nextProps.estates.updateEstate){

        if(nextProps.estates.updateEstate.success){
            toast.success("Estate Successfully created") 
            nextProps.history.push('/admin/view/estate')
            return {
          
                loading:false,
                
                 
              }
        }

        if(nextProps.estates.updateEstate.response){
            console.log("Hello from yusu",nextProps.estates.updateEstate.response );
            if(nextProps.estates.updateEstate.response.status === 400){
                console.log("previous state",prevState);
                console.log("previous props", nextProps);
         if(nextProps.estates.updateEstate.response.data.error){
             toast.error(nextProps.estates.updateEstate.response.data.message)  
              nextProps.clearEstate()
             return {
                    loading:false,
                      
                     prevState
                     }
         }else{
             toast.error(nextProps.estates.updateEstate.response.data.error) 
             nextProps.clearEstate() 
             return{
                 loading:false,
                 prevState
              }
         }
     
   }
        }
        

    }

       
   
        
        
    if(nextProps.states.getStateCities){

        if(nextProps.states.getStateCities.result.lgas !== prevState.formdata.lga.config.options){
            return{
                formdata:{
                      ...prevState.formdata,
                    lga:{
                        ...prevState.formdata.lga,
                        config:{
                            ...prevState.formdata.lga.config,
                            options:nextProps.states.getStateCities.result.lgas
                        }
                    }
                }
            }
            
          }
    }
    

    if(nextProps.states.getStates){

    if(nextProps.states.getStates.result !== prevState.formdata.state.config.options){
        return{
            formdata:{
                  ...prevState.formdata,
                state:{
                    ...prevState.formdata.state,
                    config:{
                        ...prevState.formdata.state.config,
                        options:nextProps.states.getStates.result
                    }
                }
            }
        }
        
      }
    
}else{
    return null
}
 
  return null  
}
  

    componentWillUnmount(){
        this.props.clearEstate()
    }
    submitButtun = ()=>{
        return (
            this.state.loading ?
            'updating Esate...'
            :
            <div>
                <button onClick={(event)=> this.submitForm(event)}><FontAwesomeIcon icon={faSave} color="#FFFFFF"/>  Update and continue </button>
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

    this.props.getAllStates();
    this.props.getEstate(this.props.match.params.id);
        
               
        this.loadLga();
      
      if(this.props.estates.getEstate){
       let data = this.props.estates.getEstate.result;
       let  newFormData = {...this.state.formdata};
       
       let newElement = {...newFormData['estateID']}
       newElement.value  = data.estateID;
       newFormData["estateID"] = newElement  //data.estateID

        newElement = {...newFormData['name']}
       newElement.value  = data.name;
       newFormData["name"] = newElement 

       newElement = {...newFormData['state']}
       newElement.value  = data.state;
       this.props.getAllStateCities(data.state);
       newFormData["state"] = newElement 

       newElement = {...newFormData['lga']}
       newElement.value  = data.lga;
       newFormData["lga"] = newElement 

       newElement = {...newFormData['address']}
       newElement.value  = data.address;
       newFormData["address"] = newElement 

       newElement = {...newFormData['longitude']}
       newElement.value  = data.longitude;
       newFormData["longitude"] = newElement 
       
       newElement = {...newFormData['latitude']}
       newElement.value  = data.latitude;
       newFormData["latitude"] = newElement 
       
       newElement = {...newFormData['status']}
       newElement.value  = data.status;
       newFormData["status"] = newElement 

       this.setState({
         formdata:newFormData
       })

      }

    }

    loadLga = () =>{

        const newFormData = {...this.state.formdata};
        const newElement = {...newFormData['lga']}


        if(this.props.states.getStateCities){
            newElement.config.options = this.props.states.getStateCities.result.lgas;
        }
       
        newFormData['lga'] = newElement;
        
        this.setState({
            formdata: newFormData
        })
    }
    getStatus = (event)=>{
        const newFormData = {...this.state.formdata};
        const newElement = {...newFormData['status']}

          newElement.value = event.target.value;
          newFormData['status'] = newElement;

          console.log("Value from ", event.target.value);

          this.setState({
              formdata:newFormData
          })
        
    }
    render() {
       
        return (
            <Container className="p-3 text-center text-mutted">
                 <p className="pt-3"><FontAwesomeIcon icon={faCube} size="lg"/> Update Estate</p>
                 <div className={`animate__animated animate__fadeInUp shadow-sm p-3 mb-5 bg-white rounded ${styles.formContainer}`}>
               <div className="row">
                    <div className="col-sm-9">
                 <form onSubmit={(event)=> this.submitForm(event)} >
                  <FormField  
                      id='estateID'
                      formdata={this.state.formdata.estateID}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='name'
                      formdata={this.state.formdata.name}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='state'
                      formdata={this.state.formdata.state}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='lga'
                      formdata={this.state.formdata.lga}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='address'
                      formdata={this.state.formdata.address}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='longitude'
                      formdata={this.state.formdata.longitude}
                      change={(element)=> this.updateForm(element)}

                  />
                  <FormField  
                      id='latitude'
                      formdata={this.state.formdata.latitude}
                      change={(element)=> this.updateForm(element)}

                  />

         
                {this.submitButtun()}
                {this.showError()} 
              </form>

                    </div>
                    <div className="col-sm-3 pt-3">
                        <div><button className="btn btn-sm btn-danger">Delete Estate</button></div>
                        <div><select className="btn btn-sm btn-succes pt-2" onChange={this.getStatus}>
                                <option>Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                              </div>
                    </div>

               </div>
          </div>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    //console.log("from state", state);
    return {
        estates: state.estates,
        states:state.states
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        createEstate,
        getAllStates,
        getAllStateCities,
        clearEstate,
        getEstate,
        updateEstate
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateEstate);