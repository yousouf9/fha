const express = require('express');
const {CREATE_ADMIN_GROUP, UPDATE_ADMIN_GROUP, FIND_ADMIN_GROUP, DELETE_ADMIN_GROUP, USERTYPE} = require("../Constants/constants")
const {Admin} = require('../Models/adminModel');
const adminAuth = require('../Middlewares/adminAuth');
const {AdminGroup}  = require('../Models/adminGroup');
const Router = express.Router();


Router.post('/create/group', adminAuth, async (req, res) =>{
    const admin = req.admin;
    const group = await AdminGroup.findById(admin.group);

    const haspermission = admin.hasPermissionTo(CREATE_ADMIN_GROUP)

    if(haspermission){

       if(group.name !== USERTYPE.SUPER) return res.status(403).json({error: "You don't have the permission to create Group"});

        const admingroup = new  AdminGroup(req.body);
        console.log(admingroup);
    
    
        const result = await admingroup.save();
    
        res.status(200).json({
            success:true,
            group: result
        })
        
    

    }else{
        res.status(403).json({error: "You don't have the permission to create Group"});
    }

   
})

// add permission to group
Router.put('/update/group/add/permission/:id', adminAuth, async (req, res) =>{

    const admin = req.admin;
    const group = await AdminGroup.findById(admin.group);

     const haspermission = admin.hasPermissionTo(UPDATE_ADMIN_GROUP)

      if(haspermission){

        if(group.name !== USERTYPE.SUPER) return res.status(403).json({error: "You don't have the permission to update Group"});
    
     
      
 
        const admsingroup = await AdminGroup.findOneAndUpdate({_id:req.params.id}, {
                $push:{
                    "permissions":req.body.permissions
                }
        },{new:true,useFindAndModify:true})
    
    
        if(!admsingroup) return res.status(400).json({error: 'failed to update'})
    
    
        res.status(200).json({
            success:true,
        })


   }else{
        res.status(403).json({error: 'You donot have the permission to update admingroup'});
    }


})

//update admin user permission
Router.put('/update/group/:id', adminAuth, async (req, res) =>{
    
    const admin = req.admin;
    const group = await AdminGroup.findById(admin.group);

    const haspermission = admin.hasPermissionTo(UPDATE_ADMIN_GROUP)

    if(haspermission){

        if(group.name !== USERTYPE.SUPER) return res.status(403).json({error: "You don't have the permission to creat Group"});
    
     
      
 
        const admsingroup = await AdminGroup.findOneAndUpdate({_id:req.params.id, "permissions.name":req.body.permissions.name}, {
                $set:{
                    "permissions.$.name":req.body.permissions.name,
                    "permissions.$.permit":req.body.permissions.permit
                }
        },{new:true,useFindAndModify:true})
    
    
        if(!admsingroup) return res.status(400).json({error: 'failed to update'})
    
        
    
    
        res.status(200).json({
            success:true,
        })
        
    

    }else{
        res.status(403).json({error: 'You donot have the permission to update admingroup'});
    }

   
})

Router.get('/find/group/:id', adminAuth, async(req, res)=>{
    
    const admin = req.admin;
    const group = await AdminGroup.findById(admin.group);

    const haspermission = admin.hasPermissionTo(FIND_ADMIN_GROUP)

    if(haspermission){

        if(group.name !== USERTYPE.SUPER) return res.status(403).json({error: "You don't have the permission to Group"});
    
        const admingroup = await AdminGroup.findById(req.params.id);
      
         
        if(!admingroup) return res.status(400).json({error: 'Group not found'});
    
        res.status(200).json(
            admingroup);
         
    }else{
        res.status(403).json({error: "You don't have the permission to  Group"});
    }

    

})
Router.get('/find/groups',  adminAuth, async(req, res)=>{
    
    const admin = req.admin;
    const group = await AdminGroup.findById(admin.group);
    
    
    const haspermission = admin.hasPermissionTo(FIND_ADMIN_GROUP)

    if(haspermission){

        if(group.name !== USERTYPE.SUPER) return res.status(403).json({error: "You don't have the permission to find Group"});
    
        const admingroup = await AdminGroup.find()
                                            .select({'name': 1, 'permissions':1});
      
         
        if(!admingroup) return res.status(400).json({error: 'Groups not found'});
    
        res.status(200).json(
            admingroup);

    }else{
        res.status(403).json({error: "You don't have the permission to find Group"});
    }
    
    
     

})

Router.delete('/delete/group/:id', adminAuth,  async(req, res)=>{

    const admin = req.admin;
    const group = await AdminGroup.findById(admin.group);

    const haspermission = admin.hasPermissionTo(DELETE_ADMIN_GROUP)

    if(haspermission){
        if(group.name !== USERTYPE.SUPER) return res.status(403).json({error: "You don't have the permission to delete Group"});
    
    const admingroup = await AdminGroup.findOneAndRemove({_id:req.params.id}, {useFindAndModify:false});

    if(!admingroup) return res.status(400).json({error: 'Group not found'});

    res.status(200).json(
        {
            success:true,
            result:admingroup
        }
       );
    }else{
        res.status(403).json({error: "You don't have the permission to delete Group"});
    }
    
    
     

})

module.exports = Router;