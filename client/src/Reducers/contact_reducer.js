export default function(state = {}, action) {
    
    switch(action.type){
        case 'GET_ALL_CONTACT':
            return {...state, getAllContacts:action.payload}
        default:
            return state

    }
}