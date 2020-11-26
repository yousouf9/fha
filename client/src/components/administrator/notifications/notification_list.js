import React, { PureComponent } from 'react';
import {getNotifications} from '../../../Actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import NotificationTemplate from '../../../widgets/notificationTemp';


class Notification_list extends PureComponent {

    constructor(props){
         super(props)
          
         props.getNotifications(0, 5, 'desc')

       
    }



    loadmore =()=>{
        console.log(this.props);
        const count =  this.props.notifications.getNotifications.length;
        
        console.log("from count", this.props.notifications.getNotifications);
        this.props.getNotifications(count, 4, "desc", this.props.notifications.getNotifications)
 
    }

    render() {
        console.log(this.props)
        return (
            <div className="container p-4">
                 <h2>Notifictions</h2>
                 <div className="shadow-sm p-4 mb-5 bg-white rounded">
                   <NotificationTemplate type="notification" {...this.props}/>
                   <div className="px-4 btn btn-block btn-outline-success"
                    onClick={this.loadmore}
                    >Loadmore</div>
                 </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getNotifications
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification_list);