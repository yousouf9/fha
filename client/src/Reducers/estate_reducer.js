export default function(state = {}, action) {
    
    switch(action.type){
        case 'CREATE_ESTATE':
            return {...state, createEstate:action.payload}
        case 'CLEAR_ESTATE':
            return {...state, createEstate:action.payload}
         case 'UPDATE_ESTATE':
            return {...state, updateEstate:action.payload}
        case 'GET_ALL_ESTATE':
            return {...state, getAllEstate:action.payload}
        case 'GET_ESTATE':
            return {...state, getEstate:action.payload}
        default:
            return state

    }
}