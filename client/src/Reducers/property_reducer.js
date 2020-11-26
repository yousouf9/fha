export default function(state = {}, action) {
    
    switch(action.type){
        case 'ADVANCED_SEARCH_PROPERTY':
            return {...state, advancedSearchProperty:action.payload}
        default:
            return state

    }
}