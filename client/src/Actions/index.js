import axios from 'axios';


export  function getProperties({start, limit, order}){
    const request = axios.get('/api/properties?st')
   
    return {
        type:"GET_PROPERTIES",
        payload: request

    }
}

export  function advancedSearchProperty({state, lga, radius, propertyType,sizeMax, sizeMin, priceMax, priceMin, name, bedrooms, bathrooms}){
    const request = axios.get(`/api/property/search?state=${state}&lga=${lga}&radius=${radius}&propertyType=${propertyType}&sizeMax=${sizeMax}&sizeMin=${sizeMin}&priceMax=${priceMax}&priceMin=${priceMin}&name=${name}&bedrooms=${bedrooms}&bathrooms=${bathrooms}`)
                         .then(response => response.data)
                         .catch(err => console.log(err));
   
    return {
        type:"ADVANCED_SEARCH_PROPERTY",
        payload: request

    }
}

export  function getAllStates(){
    const request = axios.get('/api/country/states')
                         .then(response => response.data);
   
    return {
        type:"GET_ALL_STATES",
        payload: request

    }
}

export  function getAllStateCities(state){

    const request = axios.get(`/api/country/state/${state}`)
                         .then(response => response.data);
   
    return {
        type:"GET_ALL_STATE_CITIES",
        payload: request

    }
}


//** CONTACTS FORM ACTIONS */

export  function contact_us({name, subject, message, email}){

    const request = axios.post('/api/contact/send', {name, subject, message, email})
                         .then(response => response.data)
                         .catch(err => err.response )
   
    return {
        type:"GET_ALL_CONTACT",
        payload: request

    }
}

//Admin login
export function adminUser({email, password}){
    const request = axios.post('/api/admin/login', {email, password})
                        .then((response)=>{
                            return response.data;
                        })         
                   
    return {
        type: "ADMIN_LOGIN",
        payload:request
    }
}

//authenticate admin
export function authenticateAdmin(){
    
    const request = axios.get("/api/admin/auth")
                        .then(response => response.data)
    return {
        type: "AUTH_ADMIN",
        payload: request
    }

}
/** Estates Actions */

export function getAllEstate(start=0, limit=100, order="desc"){

    const request = axios.get(`/api/admin/findAll/estate?start=${start}&limit=${limit}&=${order}`)
                    .then(response => response.data)
        return {

                type: "GET_ALL_ESTATE",
                payload: request
      }

}
export function createEstate(data){

    const request = axios.post('/api/admin/create/estate', data)
                    .then(response => response.data)
        return {

                type: "CREATE_ESTATE",
                payload: request
      }

}
export function updateEstate(id, data) {
     const request = axios.put(`/api/admin/update/estate/${id}`, data)
                         .then(response => response.data)
            return {

                    type: "CREATE_ESTATE",
                    payload: request
        }

}

export function getEstate(id) {
    const request = axios.get(`/api/admin/find/estate/${id}`)
      .then(response => response.data)
          return {

            type: "GET_ESTATE",
            payload: request
         }
        
}

export function clearEstate(){
 
        return {

                type: "CLEAR_ESTATE",
                payload: {}
      }

}
 
/** PLOTS Actions   */
export function createPlot(data){

    const request = axios.post('/api/admin/create/plot', data)
                    .then(response => response.data)
        return {

                type: "CREATE_PLOT",
                payload: request
      }

}

export function clearPlot(){
 
        return {

                type: "CLEAR_PLOT",
                payload: {}
      }

}
/**  Messaging and Notifications Actions   */

export function getMessageCount(){
    const request =  axios.get('/api/admin/find/messages/new/count')
                          .then(response => response.data)
                          .catch(err => err.data)
            return {
            type: "MESSAGE_COUNT",
            payload: request
        }
    
}

export function getMessage(id){
    const request =  axios.get(`/api/admin/find/message/${id}`)
                          .then(response => response.data)
                          .catch(err => err.data)
            return {
            type: "MESSAGE",
            payload: request
        }
    
}

export function sendMessage(data){
    const request = axios.post('/api/admin/send/message',  data)
                        .then(response => response.data)
                        .catch(err => err.data)

            return {
                type: "SEND_MESSAGE",
                payload: request
            }
                    
}

export function getNotificationCount(){
    const request =  axios.get('/api/admin/find/notification/new/count')
                          .then(response => response.data)
                          .catch(err => err.data)
            return {
            type: "NOTIFICATION_COUNT",
            payload: request
        }
    
}

export function getNotifications(start=0, limit=10, order="asc", list=""){

    const request = axios.get(`/api/admin/find/my/nofications?start=${start}&limit=${limit}&order=${order}`)
                        .then((response) => {
                         
                            if(list){

                            return [...list,...response.data];
                            }else{

                                return response.data;
                            }
                         })
                        //.catch(err => err.data)
         return {
                type: "NOTIFICATIONS",
                payload: request
            }
  

}

export function deleteNotification(id){
    const request =  axios.delete(`/api/admin/delete/notification/${id}`)
                        .then(response => response.data)
                        .catch(err => err.data)
        return {
        type: "DELETE_NOTIFICATION",
        payload: request

        }
}