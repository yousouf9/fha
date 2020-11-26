const express = require('express');
const { Estate, validateInput } = require('../Models/estateModel');
const adminAuth = require('../Middlewares/adminAuth');
const {

    USERTYPE,  
    CREATE_ESTATE,
    UPDATE_ESTATE,
    DELETE_ESTATE,
    FIND_ESTATE,     

} = require('../Constants/constants');


const Router = express.Router();


Router.post('/create/estate', adminAuth,  async (req, res)=>{
 
        const currentAdmin = await req.admin;

        //validating user inputs
        const {error}  = validateInput(req.body);
        if(typeof error !== 'undefined') return res.status(400).json({error: error});
    
        //checking for the existing of an Admin
        const isEstateAvailable =await Estate.findOne({estateID: req.body.estateID});
        if(isEstateAvailable) return res.status(400).json({error: 'This estate already exist in the system'});
    
    
        const options = {
            superAdmin: CREATE_ESTATE,
            stateAdmin: CREATE_ESTATE,
            admin: CREATE_ESTATE,
        }
    
    
        const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

        if(!haspermision) res.status(403).json({error:"you do not have the permision to create estate"});
    
        switch(currentAdmin.group.name){
            case USERTYPE.SUPER:
    
                const estate_super = new Estate(req.body);
    
                if(!estate_super)  return res.status(400).send("Invalid Estate details");
                
                const result_super = await estate_super.save();
    
                if(!result_super) return res.status(400).send('Failed to save new estate');
    
                res.status(200).json({
                    success:true,
                    result:result_super
                })
    
                break;
            case USERTYPE.STATEADMIN:
            case USERTYPE.ADMIN:
    
                if(req.body.state !== currentAdmin.state) return res.status(400).json({
                    error: true,
                    message: "you cannot create an estate that is not from your state!"
                });

                const estate_state = new Estate(req.body);
    
                if(!estate_state)  return res.status(400).send("Invalid Estate details");
                
                const result_state = await estate_state.save();
    
                if(!result_state) return res.status(400).send('Failed to save new estate');
    
                res.status(200).json({
                    success:true,
                    result:result_state
                }) 
                break;   
            default:
                return res.status(403).json({error: "Not a valid Admin"})    
        }
})

Router.put('/update/estate/:id', adminAuth, async (req, res)=>{
     
    console.log(req.body);
    const currentAdmin = await req.admin;

    //validating user inputs
    const {error}  = validateInput(req.body);
    if(typeof error !== 'undefined') return res.status(400).json({error: error});

 
    const options = {
        superAdmin: UPDATE_ESTATE,
        stateAdmin: UPDATE_ESTATE,
        admin: UPDATE_ESTATE,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to update estate"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
        const estate_super =  await Estate.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                }
        },{new:true,useFindAndModify:true});

        if(!estate_super)  return res.status(400).send("Failed to update estate");

        res.status(200).json({
            success:true,
            result:estate_super
        })


            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            if(req.body.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you cannot update an estate that is not from your state!"
            });

        const estate_state =  await Estate.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                }
        },{new:true,useFindAndModify:true});

        if(!estate_state)  return res.status(400).send("Failed to update estate");

        res.status(200).json({
            success:true,
            result:estate_state
        })   
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }


})

Router.delete('/delete/estate/:id', adminAuth, async (req, res)=>{

    const currentAdmin = await req.admin;



 
    const options = {
        superAdmin: DELETE_ESTATE,
        stateAdmin: DELETE_ESTATE,
        admin: DELETE_ESTATE,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to delete estate"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
            const estate_super =  await Estate.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!estate_super)  return res.status(400).send("Failed to Delete Estate");

            res.status(200).json({
                success:true,
                result:estate_super
            })


            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            const estate_state = await Estate.findById(req.params.id)

            if(estate_state.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you do not have access to this estate!"
            });

             estate_state =  await Estate.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!estate_state)  return res.status(400).send("Failed to Delete Estate");

            res.status(200).json({
                success:true,
                result:estate_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }

});

Router.get('/find/estate/:id', adminAuth, async (req, res)=>{
    const currentAdmin = await req.admin;
 
    const options = {
        superAdmin: FIND_ESTATE,
        stateAdmin: FIND_ESTATE,
        admin: FIND_ESTATE,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to this estate"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
            const estate_super =  await Estate.findOne({_id:req.params.id});

            if(!estate_super)  return res.status(404).send("Failed to find Estate");

            res.status(200).json({
                success:true,
                result:estate_super
            })

            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            const estate_state =  await Estate.findOne({_id:req.params.id});

            if(!estate_state)  return res.status(404).send("Failed to find Estate");


            if(estate_state.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you do not have access to this estate!"
            });

           

            res.status(200).json({
                success:true,
                result:estate_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }


});


Router.get('/findAll/estate', adminAuth, async(req, res)=>{

    
    const currentAdmin = await req.admin;
 
    const options = {
        superAdmin: FIND_ESTATE,
        stateAdmin: FIND_ESTATE,
        admin: FIND_ESTATE,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to this estate"});
    

  let  order = parseInt(req.query.order);
  let   limit = parseInt(req.query.limit);
  let   skip = parseInt(req.query.start);







    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            filetr = {
                state: req.query.state,
                lga : req.query.lga,
                status: req.query.status,
                address: req.query.address
            }
        
        
           const exists_super = Object.keys(filetr).every((property)=>{
              return filetr[property] 
           })
        
           let estate_super = null;
            if(!exists_super){
                estate_super = await Estate.find()
                                  .skip(skip)
                                  .sort(sortOrder(order))
                                  .limit(limit);
        
            }else{
                estate_super = await Estate.find(filetr);
            }
         
            if(!estate_super) return res.json({error: "Empty search result"})
        


            res.status(200).json({
                success:true,
                result:estate_super
            })

            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

 
            filetr = {
                state:currentAdmin.state,
                lga : req.query.lga,
                status: req.query.status,
                address: req.query.address
            }
        
        
           const exists_state = Object.keys(filetr).every((property)=>{
              return filetr[property] 
           })
        
           let estate_state = null;
            if(!exists_state){
                estate_state = await Estate.find({state:currentAdmin.state})
                                  .skip(skip)
                                  .sort(sortOrder(order))
                                  .limit(limit);
        
            }else{
                estate_state = await Estate.find(filetr);
            }
         
            if(!estate_state) return res.json({error: "Empty search result"})
        


            res.status(200).json({
                success:true,
                result:estate_state
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