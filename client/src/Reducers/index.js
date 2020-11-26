import  {combineReducers} from 'redux';
import messages from './message_reducer';
import notifications from './notify_reducer';
import admin from './admin_reducer';
import user from './user_reducer';
import plot from './plot_reducer';
import properties from './property_reducer';
import estates from './estate_reducer';
import groups from  './group_reducer';
import states from  './state_reducer';
import contacts from  './contact_reducer';




const rootReducer = combineReducers({
     messages,
     notifications,
     admin,
     user,
     plot,
     properties,
     estates,
     groups,
     states,
     contacts
})

export default rootReducer;