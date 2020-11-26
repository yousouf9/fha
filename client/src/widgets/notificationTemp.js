import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import {deleteNotification} from '../Actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

class NotificationTemp extends PureComponent {
  
    constructor(props){
        super(props);
    }


   deleteNotification = (event, id) =>{
        event.preventDefault();
       this.props.deleteNotification(id);
    }
    renderNotificationMessages = () =>{
        let   template = null;

        switch(this.props.type){
         case "notification":
             return(
                this.props.notifications.getNotifications ?
                     this.props.notifications.getNotifications?
                     template = this.props.notifications.getNotifications.map((item, i)=>(
                        !item.status ? 
                          <Link to={`/admin/message/${item.message._id}`} key={i} style={{
                              textDecoration:"none"
                          }}>
                             <div className="d-flex alert alert-info" >
                                <div className=" w-100  ">
                                    <p>{item.message.admin.name.first} {item.message.admin.name.last} sent you a message</p>
                                </div>
                                <div className=" flex-shrink-1" onClick={(event) => this.deleteNotification(event, item._id)} style={{
                                    fontSize:'25px',
                                    color: '#f00'
    
                                }}>X</div>
                            </div>
                          </Link>
                         : <Link to={`/admin/message/${item.message._id}`} key={i} style={{
                            textDecoration:"none"
                        }}>
                           <div className="d-flex alert alert-secondary">
                              <div className=" w-100  ">
                                  <p>{item.message.admin.name.first} {item.message.admin.name.last} sent you a message</p>
                              </div>
                              <div className=" flex-shrink-1" onClick={(event) => this.deleteNotification(event, item._id)} style={{
                                  fontSize:'25px',
                                  color: '#f00'
    
                              }}>X</div>
                          </div>
                        </Link>
                     ))
                     :null 
        
                     :null
                 
                      
             )
        
          default:
              return template = null  
        }

    }

   render(){
    return (
        <div>
               {this.renderNotificationMessages()}
        </div>
    );
   }
};

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        deleteNotification
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationTemp);