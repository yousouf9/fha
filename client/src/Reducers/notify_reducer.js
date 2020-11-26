export default function(state = {}, action) {
    
    switch(action.type){
        case 'NOTIFICATION_COUNT':
            return {...state, notificationCount:action.payload}
        case 'NOTIFICATIONS':
            return {...state, getNotifications:action.payload}
        case 'DELETE_NOTIFICATION':
            return {...state,  getNotifications: state.getNotifications.filter((item, i)=> item._id !== action.payload.result._id)}

        default:
            return state

    }
}