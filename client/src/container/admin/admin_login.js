import React, { Component } from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {adminUser} from '../../Actions';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-toastify'
import {Container} from 'react-bootstrap'

class Login extends Component {



         state ={
             email:"",
             password:"",
             error:"",
             success:false
         }


    emailHandler = (event)=>{
        this.setState({
            email:event.target.value
        })
    }

    passwordHandler = (event)=>{
        this.setState({
            password:event.target.value
        })

    }

    static getDerivedStateFromProps(nextProps){
        console.log(nextProps);
        if(nextProps.admin.admin_login){
            if(nextProps.admin.admin_login.isAuth){
                toast.success('Login successful')
                return nextProps.history.push('/administrator')
            }
           
        }

        return null
    } 

    submitForm = (event)=>{
        event.preventDefault();

        this.props.adminUser(this.state)



        if(this.props.admin.admin_login){
            if(this.props.admin.admin_login.response){
               console.log(this.props)
               toast.error(`${this.props.admin.admin_login.response.data.message}`)
             
            }
        }
        
        
                
               
        
    }
    

    render() {
        return (
            <Container className="header-wrapper">
            <div className={`animate__animated animate__fadeInUp shadow-sm p-3 mb-5 bg-white rounded text-center`}>
               

                    <div className="d-flex bd-highlight">
  <div className="pl-5 w-100 bd-highlight py-5">
  <form onSubmit={this.submitForm}  >
  <h2 className="text-success border border-success border-right-0 text-left font-weight-bold p-2">Login</h2>
              <div className="innercontent border border-success border-right-0 pt-2 ">        
                 <Container className="pb-3">      
                    <div className="form_element my-2">
                        <input      className="form-control"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={this.state.email}
                                    onChange={this.emailHandler}
                        />
                    </div>
                    <div className="form_element mb-2">
                        <input  className="form-control"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={this.passwordHandler}
                        />

                    </div>
                    <div className="d-flex bd-highlight mb-3">
                        
                        <div className="custom-control custom-checkbox pt-3">
                            <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                            <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                            </div>
                       
                     
                        <div className="ml-auto p-3 bd-highlight">
                            <a href="/admin/forgot_password">Forgot Password</a>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-block btn-success">Login <FontAwesomeIcon icon={faSignInAlt}/></button>
                   
                      </Container>   
                 </div>
                 
    
           </form>
  </div>
  <div className="pr-5 border border-white d-none d-md-flex d-lg-flex flex-shrink-1 bd-highlight ">
        <div className="w-100 h-100 p-4 bg-success">
                   
        </div>
  </div>
</div>
             
                
            </div>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    
    return {
        admin: state.admin
    }
}

const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
    adminUser,
   }, dispatch)
}
export default  connect(mapStateToProps, mapDispatchToProps )(Login);