const express = require('express');
const { Admin, validateInput } = require('../Models/adminModel');
const adminAuth = require('../Middlewares/adminAuth');
const {USERTYPE, 
    USERGROUP, 
    CREATE_SUPER_ADMIN,
    CREATE_STATE_ADMIN,
    CREATE_ADMIN,
    UPDATE_SUPER_ADMIN,
    UPDATE_STATE_ADMIN,
    UPDATE_ADMIN,
    FIND_STATE_ADMIN,
    FIND_SUPER_ADMIN,
    FIND_ADMIN,
    DELETE_ADMIN,
    DELETE_STATE_ADMIN,
    DELETE_SUPER_ADMIN,  

} = require('../Constants/constants');

const Router = express.Router();


Router.post('/create', adminAuth, async(req, res)=>{


    const currentAdmin = await req.admin;
   // const group =  await AdminGroup.findById(currentAdmin.group);
    req.body.createdBy = currentAdmin._id
     
    //validating user inputs
    const {error}  = validateInput(req.body);
    if(typeof error !== 'undefined') return res.status(400).json({error: error});

    //checking for the existing of an Admin
    const isEmailAvailable =await Admin.findOne({email: req.body.email});
    if(isEmailAvailable) return res.status(400).json({error: 'This admin already exist on the system'});


    const options = {
        superAdmin: CREATE_SUPER_ADMIN,
        stateAdmin: CREATE_STATE_ADMIN,
        admin: CREATE_ADMIN,
    }


    const haspermision = currentAdmin.hasPermissionTo(permission(req.body.group, options))

    if(haspermision){
        //checking  admin user group to carry out approriate actions
    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            const admin_super = new Admin(req.body);

            if(!admin_super)  return res.status(400).send("Invalid admin details");

            //hashing password
             admin_super.password = await Admin.encryptPassword(admin_super.password);

            
            const result_super = await admin_super.save();

            if(!result_super) return res.status(400).send('Failed to save new admin');

            res.status(200).json({
                success:true,
                result:result_super
            })

            break;
        case USERTYPE.STATEADMIN:

            if(req.body.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you cannot create an admin that is not from your state!"
            });

            if(req.body.group === USERGROUP.SUPER || req.body.group === currentAdmin.group) return res.status(400).json({
                error: true,
                message: "you cannot create a super admin nor  a state admin!"
            });
            
            const admin = new Admin(req.body);

            if(!admin)  return res.status(400).send("Invalid admin details");

               //hashing password
            admin.password = await Admin.encryptPassword(admin.password);

            const result = await admin.save();

            if(!result) return res.status(400).send('Failed to save new admin');

            res.status(200).json({
                success:true,
                result:result
            })
            break;
        case USERTYPE.ADMIN:
            res.json({
                error: true,
                message: "you cannot create an admin!"
            })
            break;    
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }

    }else{
       res.status(403).json({error:"you do not have the permision to create admin"})
    }



})



Router.put('/update/:id', adminAuth, async(req, res)=>{

    const currentAdmin = await req.admin;

    const options = {
        superAdmin: UPDATE_SUPER_ADMIN,
        stateAdmin: UPDATE_STATE_ADMIN,
        admin: UPDATE_ADMIN,
    }



    
    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to update admin"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            const admin_super =  await Admin.findOneAndUpdate({_id:req.params.id}, {
                    $set:{
                         ...req.body,
                    }
            },{new:true,useFindAndModify:true});

            if(!admin_super)  return res.status(400).send("Failed to update Admin");

            res.status(200).json({
                success:true,
                result:admin_super
            })

            break;
        case USERTYPE.STATEADMIN:

            if(req.body.state !== currentAdmin.state) return res.status(400).json({
                error: true,
                message: "you cannot update an admin that is not from your state!"
            });

            if(req.body.group === USERGROUP.SUPER) return res.status(400).json({
                error: true,
                message: "you cannot update an super admin nor  a state admin!"
            });

            if(!(currentAdmin.group === USERGROUP.STATEADMIN && currentAdmin._id === req.params.id)) return res.status(400).json({
                error: true,
                message: "you cannot update an super admin nor  a state admin!"
            });
            
        const admin_state =  await Admin.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                }
        },{new:true,useFindAndModify:true});

        if(!admin_state)  return res.status(400).send("Failed to update Admin");

            res.status(200).json({
                success:true,
                result:admin_state
            })
            break;
        case USERTYPE.ADMIN:

            if(!(currentAdmin._id === req.params.id))  return res.status(400).send("Cannot update admin")

        const admin=  await Admin.findOneAndUpdate({_id:req.params.id}, {
                $set:{
                     ...req.body,
                }
               },{new:true,useFindAndModify:true});

        if(!admin)  return res.status(400).send("Failed to update Admin");

            res.json({
                success: true,
                result: admin
            })
            break;    
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }

    

})

Router.put('/update/add/permission/:id', adminAuth, async(req, res)=>{

    const currentAdmin = await req.admin;

    const options = {
        superAdmin: UPDATE_SUPER_ADMIN,
        stateAdmin: UPDATE_STATE_ADMIN,
        admin: UPDATE_ADMIN,
    }

    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to update admin"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            const admin_super =  await Admin.findOneAndUpdate({_id:req.params.id}, {
                    $push:{
                         "permissions":req.body.permissions
                    }
            },{new:true,useFindAndModify:true});

            if(!admin_super)  return res.status(400).send("Failed to update Admin");

            res.status(200).json({
                success:true,
                result:admin_super
            })

            break;
        case USERTYPE.STATEADMIN:

    

              const tempUser = await Admin.findById(req.params.id)
                                            .populate('group');

            if(tempUser.group.name === USERTYPE.SUPER) return res.status(400).json({
                error: true,
                message: "you cannot update an super admin nor  a state admin!"
            });

            if(currentAdmin._id === req.params.id || tempUser.state === currentAdmin.state){

                const admin_state =  await Admin.findOneAndUpdate({_id:req.params.id}, {
                    $push:{
                        "permissions":req.body.permissions
                   }
                },{new:true,useFindAndModify:true});
        
                if(!admin_state)  return res.status(400).send("Failed to update Admin");
        
                    res.status(200).json({
                        success:true,
                        result:admin_state
                    })
            }
       
            break;
        case USERTYPE.ADMIN:

            res.json({
                error: true,
                message: "you cannot add permission"
            })
            break;    
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }

    
    

})

Router.get('/find/:id', adminAuth, async(req, res)=>{

    const currentAdmin = await req.admin;

    const options = {
        superAdmin: FIND_SUPER_ADMIN,
        stateAdmin: FIND_STATE_ADMIN,
        admin: FIND_ADMIN,
    }
  
    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have access to this admin"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            const admin_super =  await Admin.findOne({_id:req.params.id});

            if(!admin_super)  return res.status(404).send("Failed to find Admin user");

            res.status(200).json({
                success:true,
                result:admin_super
            })

            break;
        case USERTYPE.STATEADMIN:

            const admin_state =  await Admin.findOne({_id:req.params.id})
                                            .populate('group');
            if(!admin_state)  return res.status(404).send("Failed to find Admin user");

            if(admin_state.group.name === USERTYPE.SUPER) return res.status(400).json({
                error: true,
                message: "you don't have access to this admin user!"
            }); 

            if(currentAdmin._id === req.params.id || admin_state.state === currentAdmin.state){

                res.status(200).json({
                    success:true,
                    result:admin_state
                })
    
            }else{
                
                res.json({
                    error:true,
                    message:"You don't have access to this admin"
                })
            }
    
            break;
        case USERTYPE.ADMIN:

            if(!(currentAdmin._id === req.params.id))  return res.status(400).send("Cannot update admin")
            const admin =  await Admin.findOne({_id:req.params.id});
            res.status(200).json({
                success:true,
                result:admin
            })

    
            break;    
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }


})

Router.get('/find', adminAuth, async(req, res)=>{

    const currentAdmin = await req.admin;

    const options = {
        superAdmin: FIND_SUPER_ADMIN,
        stateAdmin: FIND_STATE_ADMIN,
        admin: FIND_ADMIN,
    }
  
    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have access to this admin"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            const admin_super =  await Admin.find()
                                            .populate();

            if(!admin_super)  return res.status(404).send("Failed to find Admin user");

            res.status(200).json({
                success:true,
                result:admin_super
            })

            break;
        case USERTYPE.STATEADMIN:

           
            const admin_state =  await Admin.find({state:currentAdmin.state, group:{$ne:USERGROUP.STATEADMIN}})
                                            .populate('group')
            if(!admin_state)  return res.status(404).send("Failed to find Admin user");

            res.status(200).json({
                success:true,
                result:admin_state
            })


           
    
            break;
        case USERTYPE.ADMIN:
            res.json({
                error: true,
                message: "you don't have  permission"
            })
            break;    
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }






 

})
Router.delete('/delete/:id', adminAuth, async(req, res)=>{

    const currentAdmin = await req.admin;
    
    const options = {
        superAdmin: DELETE_SUPER_ADMIN,
        stateAdmin: DELETE_STATE_ADMIN,
        admin: DELETE_ADMIN,
    }

    const haspermision = currentAdmin.hasPermissionTo(permission(currentAdmin.group._id, options))

    if(!haspermision) res.status(403).json({error:"you do not have the permision to delete admin"});

    switch(currentAdmin.group.name){
        case USERTYPE.SUPER:

            const admin_super =  await Admin.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!admin_super)  return res.status(400).send("Failed to Delete Admin");

            res.status(200).json({
                success:true,
                result:admin_super
            })

            break;
        case USERTYPE.STATEADMIN:

    

              const tempUser = await Admin.findById(req.params.id)
                                            .populate('group');

            if(tempUser.group.name === USERTYPE.SUPER ||
                 currentAdmin._id === req.params.id ||
                  tempUser.state === currentAdmin.state )  return res.status(400).json({
                error: true,
                message: "you cannot delete an super admin nor  a state admin!"
            });

            const admin_state =  await Admin.findOneAndRemove({_id:req.params.id},{useFindAndModify:true});

            if(!admin_state)  return res.status(400).send("Failed to Delete Admin");

                if(!admin_state)  return res.status(400).send("Failed to update Admin");
        
                    res.status(200).json({
                        success:true,
                        result:admin_state
                    });
       
            break;
        case USERTYPE.ADMIN:

            res.json({
                error: true,
                message: "you don't have the permission"
            })
            break;    
        default:
            return res.status(403).json({error: "Not a valid Admin"})    
    }
 

})



Router.post('/login',  async (req, res)=>{
    
    const admin = await Admin.findOne({email:req.body.email});


    if(!admin) return res.status(401).json({ isAuth:false, message: 'Invalid email or password'});
  
     let validpassword  =  await Admin.validatePassword(req.body.password, admin.password);

     if(!validpassword) return res.status(400).json({ isAuth:false, message: 'Invalid email or password'}) 

     


        const token =  admin.generateToken(admin._id, admin.group);
        if(!token) return res.status(400).send(new Error('Failed to generate token'));

        let remember = req.body.rememberMe;
        if(remember){
            admin.rememberMe = remember;
        }else{
            admin.rememberMe = remember
        }
        
        
        admin.token = token;
    
      const result =  await admin.save();

      if(!result) return res.status(400).json({ isAuth:false, message: 'Invalid email or password'})
            
        res.cookie('x-auth-admin',  token).json({
                isAuth:true,
                id: admin._id,
                password: req.body.password,
                email:admin.email,
                name:admin.name,
                remember
            })

})



Router.get('/logout', adminAuth,  async(req, res)=>{

    
    
    const result = await req.admin.deleteToken(req.token);
 
   if(!result) return res.status(400).send('Failed to logout')

    res.status(200).send('Ok')
    
})

Router.get('/auth', adminAuth, (req, res)=>{

    console.log("New Auth",req.admin);
    res.status(200).json({
        isAuth:true,
        id:req.admin._id,
        email: req.admin.email,
        name:req.admin.name,
     })

})



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



module.exports = Router;