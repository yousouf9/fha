export default function(state = {}, action) {
    
    switch(action.type){
        case 'GET_ALL_STATES':
            return {...state, getStates:action.payload}
        case "GET_ALL_STATE_CITIES":
            return {...state, getStateCities:action.payload}
        default:
            return state

    }
}