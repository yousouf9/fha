export default function(state = {}, action) {
    
    switch(action.type){
        case 'MESSAGE_COUNT':
            return {...state, messageCount:action.payload}
        case 'MESSAGE': 
             return {...state, getMessage:action.payload}   
        case 'SEND_MESSAGE':
            return {...state, sendMessage:action.payload}  
        default:
            return state

    }
}