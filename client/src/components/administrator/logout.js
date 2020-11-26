import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'


const Logout = (props) => {
    let request = axios.get('/api/admin/logout')
                       .then(response => {
                        setTimeout(()=>{
                            toast.success('Logout successful')
                            props.history.push('/admin/login')
                        }, 1000)
                        
                           
                       });


    return (
        <div className="logout_container">
              <p></p>
        </div>
    );
};

export default Logout;