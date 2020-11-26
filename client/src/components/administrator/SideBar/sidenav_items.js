import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faChartBar, faUsers, faCube, faUser, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux' 



const SidenavItems = (props) => {
  
    const items = [

          {
            type:"nav-item",
            icon:faChartBar,
            text:"Infographics",
            link:"/admin/info",
            restricted:true
        },
        {
            type:"nav-item",
            icon:faCube,
            text:"Assets",
            link:"/admin/assets",
            restricted:true
        },
        {
            type:"nav-item",
            icon:faUsers,
            text:"Teams",
            link:"/admin/teams",
            restricted:true,
        },
        {
            type:"nav-item",
            icon:faUserPlus,
            text:"Add Admin",
            link:"/admin/add",
            restricted:true,
            exclude:true
        },
        {
            type:"nav-item",
            icon:faUser,
            text:"Profile",
            link:"/admin/profile",
            restricted:true
        },
        {
            type:"nav-item",
            icon:faSignOutAlt,
            text:"Logout",
            link:"/admin/logout",
            restricted:true
        },
      
    ]
  const element = (item, key) =>(
      
        <li key={key} className={`sidenav_items item.type`}>
            <Link to={item.link} className="nav-link">
                 <div className="d-inline-block item-icon-wrapper">
                     <FontAwesomeIcon icon={item.icon} size="lg"/>
                 </div>
                 <span>{item.text}</span>
            </Link>
        </li>
  ) 

  const showItems = ()=>(
           true ?
            items.map((item, i)=>{
                if(true){
                    return !item.exclude ? 
                      element(item, i)
                    :null
                }else{
                    return !item.restricted ?
                     element(item, i)
                     :null 
                }
                    //return element(item, i)
                })
       : null  

  )
    return (
        <div>
            {showItems()}
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        admin: state.admin
    }
}
export default connect(mapStateToProps)(SidenavItems);