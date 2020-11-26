import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {authenticateAdmin} from '../../../Actions'


export default function(ComposedClass, reload) {
     class AuthenticateCheck extends Component {

        state = {
            loading: true,
        }


        componentDidMount(){
            this.props.authenticateAdmin(); 
        }
        componentWillReceiveProps(nextProps){
           
            this.setState({
                loading:false
            })

            if(!nextProps.admin.admin_auth.isAuth){
                if(reload){
                    this.props.history.push('/admin/login')
                }
               
            }else{
                if(reload === false){
                    this.props.history.push('/administrator')
                }
            }

         

           
        }
        render(){

            if(this.state.loading){
                return <div className="loader">Loading...</div>
            }
             return(
                   <ComposedClass {...this.props}  admin = {this.props.admin}/>
             )
        }
     }

     const mapStateToProps = (state) => {
         return {
             admin: state.admin
         }
     }
     const mapDispatchToProps = (dispatch) => {
         return  bindActionCreators ({
             authenticateAdmin
         }, dispatch)
     }

     return  connect(mapStateToProps, mapDispatchToProps)(AuthenticateCheck);
}