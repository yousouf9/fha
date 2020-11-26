import React from 'react';
import styles from './index.module.css';

const formFields = ({id, formdata, change}) => {
    
    const showError = ()=>{
        return formdata.validation && !formdata.valid  ?
         <div className={styles.labelError}>{formdata.validationMessage}</div>
         :
         ''
    }
    const renderFormFields = () =>{

        let formTemplate = '';
       
        switch(formdata.element){
            case ('input'):
                formTemplate =(
                    <div>
                        <input

                           {...formdata.config}
                           value={formdata.value}
                           onBlur={(event)=>change({event, id, blur:true})}
                           onChange={(event)=>change({event, id, blur:false})}

                        />
                        {showError()}
                    </div>
                )
                break;
            case ('textarea'):
                    formTemplate =(
                        <div>
                            <textarea
    
                               {...formdata.config}
                               value={formdata.value}
                               onBlur={(event)=>change({event, id, blur:true})}
                               onChange={(event)=>change({event, id, blur:false})}
    
                            />
                            {showError()}
                        </div>
                    )
                break;    
            case ('select-state'):
                formTemplate = (
                    <div>
                    <select
                     

                       name={formdata.config.name}
                       value={formdata.value}
                       onBlur={(event)=>change({event, id, blur:true})}
                       onChange={(event)=>change({event, id, blur:false})}

                    >
                          <option >-- State --</option>
                        {formdata.config.options.map((item, i)=>{
                            return (
                            <option key={i} value={item.state}>{item.state}</option>
                            )
                        })}
                    </select>
                    {showError()}
                </div>
                )
                break;
                case ('select-estate_name'):
                    formTemplate = (
                        <div>
                        <select
                         
    
                           name={formdata.config.name}
                           value={formdata.value}
                           onBlur={(event)=>change({event, id, blur:true})}
                           onChange={(event)=>change({event, id, blur:false})}
    
                        >
                              <option >-- Select Estate --</option>
                            {formdata.config.options.map((item, i)=>{
                                return (
                                <option key={i} value={item._id}>{item.name}</option>
                                )
                            })}
                        </select>
                        {showError()}
                    </div>
                    )
                    break;
                case ('select-plotType'):
                        formTemplate = (
                            <div>
                            <select
                             
        
                               name={formdata.config.name}
                               value={formdata.value}
                               onBlur={(event)=>change({event, id, blur:true})}
                               onChange={(event)=>change({event, id, blur:false})}
        
                            >
                                  <option >-- Select Plot Type --</option>
                                {formdata.config.options.map((item, i)=>{
                                    return (
                                    <option key={i} value={item}>{item}</option>
                                    )
                                })}
                            </select>
                            {showError()}
                        </div>
                        )
                        break;
                case ('select-lga'):
                    formTemplate = (
                        <div>
                        <select
    
                           name={formdata.config.name}
                           value={formdata.value}
                           onBlur={(event)=>change({event, id, blur:true})}
                           onChange={(event)=>change({event, id, blur:false})}
    
                        >
                            <option >-- LGA --</option>
                            {formdata.config.options.map((item, i)=>{
                                return (
                                <option key={i} value={item}>{item}</option>
                                )
                            })}
                        </select>
                        {showError()}
                    </div>
                    )
                    break;
            default:
                formTemplate = '';
        }
        return formTemplate;
    }
    return (
        <div>
           {renderFormFields()}
        </div>
    );
};

export default formFields;