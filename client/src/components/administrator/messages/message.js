import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {getMessage, sendMessage} from '../../../Actions'
import {Modal, Button, Form} from 'react-bootstrap'
class Message extends Component {
   
    constructor(props){
        super(props);


        props.getMessage(props.match.params.id)

        this.state = {
            show:false,
             
                email:this.props.messages.getMessage.result.admin.email,
                subject:"",
                body:"",
                error:""
            
        }

        
    }


    handleShow =()=>{
        this.setState({
            show:true
        })
    }

    handleClose =()=>{
        this.setState({
            show:false
        })
    }
    

    handleInputEmail  =(event)=>{
 

        this.setState({
            email:event.target.value
        })

    }
    handleInputSubject  =(event)=>{
    
            
        this.setState({
            subject:event.target.value
        })

        console.log("from yusuf", this.state);
    }
    handleInputBody  =(event)=>{
    
        this.setState({
            body:event.target.value
        })
    }



    //Unfinished Configurations of method
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.messages === false){
         
           return {
              
                    error:"Message not sent"
                 
              }
        }else{
         return {

         

                email:"",
                subject:"",
                body:"",
                error:""
            
         }
        }
        
}

    submitForm = (event)=>{
        event.preventDefault();


        this.setState({error:''})
    
         this.props.sendMessage({
            
                email: this.state.email,
                 subject: this.state.subject,
                 body: this.state.body
                
             }
         )
    
    
}

    
  renderMessage =(message)=>{
     
         console.log(message);
       return(
        message.getMessage?
           message.getMessage.result?
              <div className="d-flex ">
                    <div className="p-2 flex-fill ">
                    <p><span style={{
                        color:"#1a936f",
                        fontSize: "25px"
                    }}>from :</span> {message.getMessage.result.admin.name.first} {message.getMessage.result.admin. name.last}</p>
                  <p><span style={{
                        color:"#1a936f",
                        fontSize: "20px"
                    }}>Contacts Details :</span></p>
                    <p>{message.getMessage.result.admin.email}</p>
                    <p>{message.getMessage.result.admin.phone}</p>
                    <p style={{
                        padding:"10px 5px",
                        backgroundColor: "rgba(0,0,0,.2)",
                        fontSize:"14px",
                        fontWeight: "300",
                        
                    }}>{message.getMessage.result.subject}</p>
                    <p style={{
                        padding:"5px 0px",
                        fontSize:"16px",
                        fontWeight: "400",
                        
                    }}>{message.getMessage.result.body}</p>
                   
                </div>
                <div className="p-2 flex-fill text-left ">
                    
                   <div className="p-2">
                   <button type="button" className="btn btn-block btn-danger" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Delete</button>
                   </div>
                   <div className="p-2">
                   <Button variant="success" className="btn-block" onClick={this.handleShow}>Reply</Button>
                        <Modal
                            show={this.state.show}
                            onHide={this.handleClose}
                            backdrop="static"
                            keyboard={false}
                            size="md"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                    <Modal.Header closeButton>
                        <Modal.Title>Reply to Message</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form onSubmit={this.submitForm}>
                          <div className="form-group" >
                                <label for="email">Email address</label>
                                <input type="email" className="form-control"  onChange={this.handleInputEmail} value={ this.state.email}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input type="text" className="form-control"  onChange={this.handleInputSubject} value={this.state.subject}  placeholder="Enter subject"/>
                            </div>
                            <div className="form-group">
                                <label for="message">Message</label>
                                <textarea className="form-control" rows="3" onChange={this.handleInputBody} value={this.state.body} ></textarea>
                            </div>
                            <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">Send Message</Button>
                        </Modal.Footer>
                          </Form>
                        </Modal.Body>
                         
                        
                    </Modal>
                   </div>
                    
                    </div>
                </div>
              :null
           :null
       )

  }

    render(){
        console.log("from props", this.props)
        return (
            <div className="container p-4">
               <h2>Message</h2>
               <div className="shadow-sm p-4 mb-5 bg-white rounded">
               
                    {this.renderMessage(this.props.messages)}
                 
               </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    console.log(state);
    return {
        messages: state.messages
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getMessage,
        sendMessage
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Message);