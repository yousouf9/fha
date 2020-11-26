import React from 'react';
import {Link} from 'react-router-dom'
import { getEstate } from '../../Actions';

const EstateList = (props) => {

     const getEstate = (event,id)=>{
          event.preventDefault();
         props.history.push(`/admin/view/estate/${id}`);
     }

    const renderEstates = (estates)=>{
             console.log(estates);

            return (
                  estates.getAllEstate?
                
               
                
                     estates.getAllEstate.result.map((item, i)=>(
                         
                            item.status?
                             
                              <tr style={{
                                   cursor: "pointer"
                              }}  className="table-success" onClick={(event) => getEstate(event, item._id)} key={i}>
                                    <td>{i+1}</td>
                                    <td>{item.estateID}</td>
                                    <td>{item.name}</td>
                                    <td>{item.state}</td>
                                    <td>{item.lga}</td>
                                    <td>{item.address}</td>
                                    <td>{item.latitude} {item.longitude}</td>
                                    <td>{`${item.status? "active" : "Inactive" }`}</td>
                                </tr>

                            : <tr style={{
                                cursor: "pointer"
                           }} className="table-dark" onClick={(event) => getEstate(event, item._id)} key={i}>
                                    <td>{i+1}</td>
                                    <td>{item.estateID}</td>
                                    <td>{item.name}</td>
                                    <td>{item.state}</td>
                                    <td>{item.lga}</td>
                                    <td>{item.address}</td>
                                    <td>{item.latitude} {item.longitude}</td>
                                    <td>{`${item.status? "active" : "Inactive" }`}</td>
                            </tr>
                     ))



                     :null
            

             )
            
        }
    
    return (
        <div className="table-responsive">
             <table className="table">
              <thead className="table-info">
                <tr>
                    <th >S/NO</th>
                    <th >Estate ID</th>
                    <th >Estate Name</th>
                    <th >State</th>
                    <th >LGA</th>
                    <th >Area</th>
                    <th >Coordinates</th>
                    <th >Status</th>
                </tr>
              </thead>
              <tbody>
                  {renderEstates(props.estates)}
              </tbody>
            </table>  
        </div>
    );
};

export default EstateList;