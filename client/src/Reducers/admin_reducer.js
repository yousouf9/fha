export default function(state = {}, action) {
    
    switch(action.type){
        case 'ADMIN_LOGIN':
            return {...state, admin_login:action.payload }
        case 'AUTH_ADMIN':
            return {...state, admin_auth:action.payload }
        default:
            return state

    }
}