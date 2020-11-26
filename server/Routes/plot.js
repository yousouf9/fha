const express = require('express');
const { Plot, validateInput } = require('../Models/plotModel');

const adminAuth = require('../Middlewares/adminAuth');
const {

    USERTYPE, 
    CREATE_PLOT,
    UPDATE_PLOT,
    DELETE_PLOT,
    FIND_PLOT,     

} = require('../Constants/constants');
const { Estate } = require('../Models/estateModel');


const Router = express.Router();


Router.post('/create/plot', adminAuth,  async (req, res)=>{
 
        const currentAdmin = await req.admin;
        const estate = await Estate.findById(req.body.estate); 

        //validating user inputs
        const {error}  = validateInput(req.body);
        if(typeof error !== 'undefined') return res.status(400).json({error: error});
    
        //checking for the existing of an Admin
       // const isPlotAvailable =await Plot.findOne({plotID: req.body.plotID});
       // if(isPlotAvailable) return res.status(400).json({error: 'This plot already exist in the system'});
    
    
        const options = {
            superAdmin: CREATE_PLOT,
            stateAdmin: CREATE_PLOT,
            admin: CREATE_PLOT,
        }
    
    
        const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

        if(!haspermision) res.status(403).json({error:"you do not have the permision to create plot"});
    
        switch(currentAdmin.group.name){
            case USERTYPE.SUPER:
    
                const plot_super = new Plot(req.body);
    
                if(!plot_super)  return res.status(400).send("Invalid Plot details");
                plot_super.estate_state =estate.state;
                plot_super.estate_lga =estate.lga;
                plot_super.estate_name =estate.name;
                
                const result_super = await plot_super.save();
    
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
                    message: "you cannot create a plot that is not from your state!"
                });

                const plot_state = new Plot(req.body);
    
                if(!plot_state)  return res.status(400).send("Invalid Plot details");
                plot_state.estate_state =estate.state;
                plot_state.estate_lga =estate.lga;
                plot_state.estate_name =estate.name;
                
                const result_state = await plot_state.save();
    
                if(!result_state) return res.status(400).send('Failed to save new plot');
    
                res.status(200).json({
                    success:true,
                    result:result_state
                }) 
                break;   
            default:
                return res.status(403).json({error: "Not a valid Admin"})    
        }
})

Router.put('/update/plot/:id', adminAuth, async (req, res)=>{

    const currentAdmin = await req.admin;
    const estate = await Estate.findById(req.body.estate); 

    //validating user inputs
    const {error}  = validateInput(req.body);
    if(typeof error !== 'undefined') return res.status(400).json({error: error});

 
    const options = {
        superAdmin: UPDATE_PLOT,
        stateAdmin: UPDATE_PLOT,
        admin: UPDATE_PLOT,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to update estate"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
        const plot_super =  await Plot.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                     estate_state:estate.state,
                estate_lga :estate.lga,
                estate_name:estate.name
                }
        },{new:true,useFindAndModify:true});

        if(!plot_super)  return res.status(400).send("Failed to update plot");

        res.status(200).json({
            success:true,
            result:plot_super
        })


            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            if(estate.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you cannot update a plot that is not in your state!"
            });

        const plot_state =  await Plot.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                }
        },{new:true,useFindAndModify:true});

        if(!plot_state)  return res.status(400).send("Failed to update plot");

        res.status(200).json({
            success:true,
            result:plot_state
        })   
        default:
            return res.status(403).json({error: "Not a valid User"})    
    }


})

Router.delete('/delete/plot/:id', adminAuth, async (req, res)=>{

    const currentAdmin = await req.admin;



 
    const options = {
        superAdmin: DELETE_PLOT,
        stateAdmin: DELETE_PLOT,
        admin: DELETE_PLOT,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to delete estate"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
            const plot_super =  await Plot.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!plot_super)  return res.status(400).send("Failed to Delete Plot");

            res.status(200).json({
                success:true,
                result:plot_super
            })


            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            let plot_state = await Plot.findById(req.params.id)

            if(plot_state.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you do not have access to this plot!"
            });

             plot_state =  await Plot.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!plot_state)  return res.status(400).send("Failed to Delete plot");

            res.status(200).json({
                success:true,
                result:plot_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }

});

Router.get('/find/plot/:id', adminAuth, async (req, res)=>{
    const currentAdmin = await req.admin;
 
    const options = {
        superAdmin: FIND_PLOT,
        stateAdmin: FIND_PLOT,
        admin: FIND_PLOT,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to this plot"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:
        
            const plot_super =  await Plot.findOne({_id:req.params.id})
                                          .populate('estate');

            if(!plot_super)  return res.status(404).send("Failed to find plot");

            res.status(200).json({
                success:true,
                result:plot_super
            })

            break;
        case USERTYPE.STATEADMIN:
        case USERTYPE.ADMIN:

            const plot_state =  await Plot.findOne({_id:req.params.id})
                                          .populate('estate');

            if(!plot_state)  return res.status(404).send("Failed to find plot");


            if(plot_state.estate.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you do not have access to this plot!"
            });

           

            res.status(200).json({
                success:true,
                result:plot_state
            })
            break;
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
        }


});


Router.get('/findAll/plot', adminAuth, async(req, res)=>{

    
    const currentAdmin = await req.admin;
 
    const options = {
        superAdmin: FIND_PLOT,
        stateAdmin: FIND_PLOT,
        admin: FIND_PLOT,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to this plot"});
    

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
        
           let plot_super = null;
            if(!exists_super){
                plot_super  = await Plot.find()
                                  .populate('estate')
                                  .skip(skip)
                                  .sort(sortOrder(order))
                                  .limit(limit);
        
            }else{
                plot_super = await Plot.find()
                                       .populate('estate')

                 const validPlots = plot_super.filter((plot)=>{
                     return (plot.estate.state === req.query.state) && (plot.estate.lga === req.query.lga)  
                 }) 
                 
                 plot_super = validPlots;
            }
         
            if(!plot_super) return res.json({error: "Empty search result"})
        


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
        
           let plot_state = null;
            if(!exists_state){
                plot_state = await Plot.find({state:currentAdmin.state})
                                  .populate('estate')
                                  .skip(skip)
                                  .sort(sortOrder(order))
                                  .limit(limit);
        
            }else{
                plot_state = await Plot.find()
                                       .populate('estate')

                                       
                 const validPlots = plot_state.filter((plot)=>{
                    return  (plot.estate.lga === req.query.lga)  
                }) 
                
                plot_state = validPlots;
            }
         
            if(!plot_state) return res.json({error: "Empty search result"})
        


            res.status(200).json({
                success:true,
                result:plot_state
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