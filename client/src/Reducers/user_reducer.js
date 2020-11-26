export default function(state = {}, action) {
    
    switch(action.type){
        case 'GET_BOOKS':
            return {...state, getBooks:action.payload}
        default:
            return state

    }
}