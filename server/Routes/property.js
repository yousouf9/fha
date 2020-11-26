const express = require('express');
const { Property, validateInput } = require('../Models/propertyModel');

const adminAuth = require('../Middlewares/adminAuth');
const {

    USERTYPE, 
    CREATE_PROPERTY,
    UPDATE_PROPERTY,
    DELETE_PROPERTY,
    FIND_PROPERTY,     

} = require('../Constants/constants');
const { Estate } = require('../Models/estateModel');


const Router = express.Router();


Router.post('/create/property', adminAuth,  async (req, res)=>{
 
        const currentAdmin = await req.admin;
        const  estate = await Estate.findById(req.body.estate); 
    
        //validating user inputs
        const {error}  = validateInput(req.body);
        if(typeof error !== 'undefined') return res.status(400).json({error: error});
    
        //checking for the existing of an Admin
        const isPropertyAvailable =await Property.findOne({propertyID: req.body.propertyID});
        if(isPropertyAvailable) return res.status(400).json({error: 'This property already exist in the system'});
    
    
        const options = {
            superAdmin: CREATE_PROPERTY,
            stateAdmin: CREATE_PROPERTY,
            admin: CREATE_PROPERTY,
        }
    
    
        const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

        if(!haspermision) res.status(403).json({error:"you do not have the permision to create property"});
    
        switch(currentAdmin.group.name){
            case USERTYPE.SUPER:
    
                const property_super = new Property(req.body);
    
                if(!property_super)  return res.status(400).send("Invalid Plot details");
                 property_super.estate_state =estate.state;
                 property_super.estate_lga =estate.lga;
                 property_super.estate_name =estate.name;
                
                const result_super = await property_super.save();
    
                if(!result_super) return res.status(400).send('Failed to save new plot');
    
                res.status(200).json({
                    success:true,
                    result:result_super
                })
    
                break;
            case USERTYPE.STATEADMIN:
            case USERTYPE.ADMIN:
    
                if(estate.state !== currentAdmin.state) return res.status(400).json({
                    error: true,
                    message: "you cannot create a property that is not from your state!"
                });

                const property_state = new Property(req.body);
    
                if(!property_state)  return res.status(400).send("Invalid Property details");
                property_state.estate_state =estate.state;
                property_state.estate_lga =estate.lga;
                property_state.estate_name =estate.name;
                
                const result_state = await property_state.save();
    
                if(!result_state) return res.status(400).send('Failed to save new property');
    
                res.status(200).json({
                    success:true,
                    result:result_state
                }) 
                break;   
            default:
                return res.status(403).json({error: "Not a valid Admin"})    
        }
})

Router.put('/update/property/:id', adminAuth, async (req, res)=>{

    const currentAdmin = await req.admin;
    const estate = await Estate.findById(req.body.estate); 

    //validating user inputs
    const {error}  = validateInput(req.body);
    if(typeof error !== 'undefined') return res.status(400).json({error: error});

 
    const options = {
        superAdmin: UPDATE_PROPERTY,
        stateAdmin: UPDATE_PROPERTY,
        admin: UPDATE_PROPERTY,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to update property"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
        const property_super =  await Property.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                    estate_state:estate.state,
                    estate_lga:estate.lga,
                     estate_name:estate.name,
                     
                }
        },{new:true,useFindAndModify:true});

        if(!property_super)  return res.status(400).send("Failed to update property");

        res.status(200).json({
            success:true,
            result:property_super
        })


            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            if(estate.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you cannot update a property that is not in your state!"
            });

        const property_state =  await Plot.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                }
        },{new:true,useFindAndModify:true});

        if(!property_state)  return res.status(400).send("Failed to update property");

        res.status(200).json({
            success:true,
            result:property_state
        })   
        default:
            return res.status(403).json({error: "Not a valid User"})    
    }


})

Router.delete('/delete/property/:id', adminAuth, async (req, res)=>{

    const currentAdmin = await req.admin;



 
    const options = {
        superAdmin: DELETE_PROPERTY,
        stateAdmin: DELETE_PROPERTY,
        admin: DELETE_PROPERTY,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to delete property"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
            const property_super =  await Property.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!property_super)  return res.status(400).send("Failed to Delete ");

            res.status(200).json({
                success:true,
                result:property_super
            })


            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            const property_state = await Property.findById(req.params.id)
                                                  .populate('estate');

            console.log(property_state);

            if(property_state.estate.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you do not have access to this property!"
            });

             const result_state =  await Property.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!result_state)  return res.status(400).send("Failed to delete property");

            res.status(200).json({
                success:true,
                result:result_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }

});

Router.get('/find/property/:id', adminAuth, async (req, res)=>{
    const currentAdmin = await req.admin;
 
    const options = {
        superAdmin: FIND_PROPERTY,
        stateAdmin: FIND_PROPERTY,
        admin: FIND_PROPERTY,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to this plot"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
            const property_super =  await Property.findOne({_id:req.params.id})
                                          .populate('estate');

            if(!property_super)  return res.status(404).send("Failed to find Property");

            res.status(200).json({
                success:true,
                result:property_super
            })

            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            const property_state =  await Property.findOne({_id:req.params.id})
                                          .populate('estate');

            if(!property_state)  return res.status(404).send("Failed to find property");


            if(property_state.estate.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you do not have access to this property!"
            });

           

            res.status(200).json({
                success:true,
                result:property_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }


});


Router.get('/findAll/property', adminAuth, async(req, res)=>{

    
    const currentAdmin = await req.admin;
 
    const options = {
        superAdmin: FIND_PROPERTY,
        stateAdmin: FIND_PROPERTY,
        admin: FIND_PROPERTY,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to this property"});
    

  let  order = parseInt(req.query.order);
  let   limit = parseInt(req.query.limit);
  let   skip = parseInt(req.query.start);







    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            filetr = {
                "estate.state": req.query.state,
                "estate.lga" : req.query.lga,
            }
        
        
           const exists_super = Object.keys(filetr).every((property)=>{
              return filetr[property] 
           })
        
           let property_super = null;
            if(!exists_super){
                property_super  = await Property.find()
                                  .populate('estate')
                                  .skip(skip)
                                  .sort(sortOrder(order))
                                  .limit(limit);
        
            }else{
                property_super = await Property.find()
                                       .populate('estate')

                 const validProperty = property_super.filter((property)=>{
                     return (property.estate.state === req.query.state) && (property.estate.lga === req.query.lga)  
                 }) 
                 
                 property_super = validProperty;
            }
         
            if(!property_super) return res.json({error: "Empty search result"})
        


            res.status(200).json({
                success:true,
                result:plot_super
            })

            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

 
          
                filetr = {
        
                    "estate.lga" : req.query.lga,
                }
            
        
        
           const exists_state = Object.keys(filetr).every((property)=>{
              return filetr[property] 
           })
        
           let property_state = null;
            if(!exists_state){
                property_state = await Property.find({state:currentAdmin.state})
                                  .populate('estate')
                                  .skip(skip)
                                  .sort(sortOrder(order))
                                  .limit(limit);
        
            }else{
                property_state = await Plot.find()
                                       .populate('estate')

                                       
                 const validProperty = property_state.filter((property)=>{
                    return  (property.estate.lga === req.query.lga)  
                }) 
                
                property_state = validProperty;
            }
         
            if(!property_state) return res.json({error: "Empty search result"})
        


            res.status(200).json({
                success:true,
                result:property_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }


 

});

function permission(group, {superAdmin, stateAdmin, admin}) {
       
        switch(group){
            case "1":
                return superAdmin
            case "2":
                return stateAdmin
            case "3":
                return admin
        }
    
    }

 function sortOrder(value) {
     switch(value){
         case 1:
             return {name: 1}
        case 2:
            return {state: 1}
        case 3:
            return {lga: 1}
        case 4:
            return {address: 1}
        case 5:
             return {status: 1}

     }
 }   
 module.exports = Router;