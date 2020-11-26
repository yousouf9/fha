export default function(state = {}, action) {
    
    switch(action.type){
        case 'CREATE_PLOT':
            return {...state, createPlot:action.payload}
        case 'CLEAR_PLOT':
            return {...state, createPlot:action.payload}
        default:
            return state

    }
}