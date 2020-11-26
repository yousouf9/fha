
const express = require('express');
const { User, validateInput } = require('../Models/userModel');
const {Account}  = require('../Models/accountModel');
const {sendMail} = require('../utility/sendMail');
const mongoose = require('mongoose');
const auth = require('../Middlewares/auth');
const { USERTYPE} = require('../Constants/constants');
const winston = require('winston');
const {Estate} = require('../Models/estateModel');
const {Property} = require('../Models/propertyModel');
const {Plot} = require('../Models/plotModel');


const Router = express.Router();

Router.post('/user', async (req, res)=>{

    const {error}  = validateInput(req.body);
    
    if(typeof error !== 'undefined') return res.status(400).json({error: error});


    const isEmailAvailable =await User.findOne({email: req.body.email});
    
    if(isEmailAvailable) return res.status(400).json({error: 'This email exist on our system'});


    const user = new User(req.body);

   if(!user) return res.status(400).json({error: 'failed to create user'});

   let account = new  Account({
    user:{
           id:user._id,
           name:'account'
       }
   })
  
    
   const verificationToken = Account.sendEmailToken(account._id);
     //update user account verification token  
     //hash user password  
     account.verificationToken= verificationToken;
     user.roles.account =account._id;
     user.password =await User.encryptPassword(user.password);




   let result = await user.save();

   if(!result) return res.status(400).send('Failed to save user');

      result = await account.save();

      if(!result) return res.status(400).send('Failed to save user');


   


   const mailto = `${req.protocol}://${req.headers.host}/api/verify-me/${verificationToken}`;
   const message = `<div>
                        <h2>Welcome to Federal Housing Agencing</h2>
                        <p>In order to have full access to our system please click on the link below</p>
                        <a href=${mailto}>Verify me</a>
                        <p>Verification link: ${mailto}</p>
                    </div>`

    
   sendMail("info@fha.com", user.email, 'Email verification', message, function(error, info){
   

    {
        if (error) {
          console.log(error);
          winston.error(error.message, error);
          res.status(400).json({
              message:'Verification email fail to send',
              error: error
          })
  

        } else {
          console.log(`Email sent: ${info.response}`);
          res.status(200).json({
              success:true,
              status:info.response
          });
        }
      }

   });   

})
Router.get('/verify-me/:token', async (req, res)=>{

    let token = req.params.token;

    const emailToken =Account.verifyEmailToken(token);

    if(!emailToken) return res.status(400).send('Invalid token');

    const account = await Account.findById(emailToken.id);

    if(!account) return res.status(400).send('User account does not exist');

    if(account.isVerified) return res.status(400).send('account already verify');

    let user = null;
    if(mongoose.Types.ObjectId.isValid(account.user.id)){
     user = await User.findById(account.user.id)
    }else{
        throw new Error('Not a valid object ID')
    }
    
    if(!user) return res.status(400).send('User account does not exist');

    account.isVerified = true;

    const result = await account.save();

    if(!result) return res.status(400).send('Failed to verify account');

    
    user.canPlayRoleOf("account");
     const returnURL = user.defaultReturnUrl();

         token =  user.generateToken(user._id, account.user.name);
     if(!token) return res.status(400).send(new Error('Failed to generate token'));
    
     user.token = token;
   
     await user.save();

     
       
      res.cookie('x-auth',  token).json({
         isAuth:true,
         id: user._id,
         email:user.email,
         returnURL: returnURL
     })

})

Router.post('/login',  async (req, res)=>{
    
    const user = await User.findOne({email:req.body.email});
    const account = await Account.findById(user.roles.account);

    if(!user) return res.status(401).json({ isAuth:false, message: 'Invalid email or username'});
  
    let validpassword  = await User.validatePassword(req.body.password, user.password);

     if(!validpassword) return res.status(401).json({ isAuth:false, message: 'Invalid email or username'}) 


                           
    const role  =  user.canPlayRoleOf(account.user.name);

     if(role){

            const token =  user.generateToken(user._id, account.user.name);
            if(!token) return res.status(400).send(new Error('Failed to generate token'));

            let remember = req.body.rememberMe;
            if(remember){
                user.rememberMe = remember;
            }else{
                admin.rememberMe = remember
            }
            
            user.token = token;
        
            await user.save();
            
                const returnURL = user.defaultReturnUrl();
                res.cookie('x-auth',  token).json({
                isAuth:true,
                id: user._id,
                email:user.email,
                password:req.body.password,
                remember,
                returnURL:returnURL
            })

     }else{
         res.status(403).send("Forbidden you don't have access to here")
    }
 
})



Router.get('/estates',  async(req, res)=>{

    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = parseInt(req.query.order);
    const estate = await Estate.find()
                            .skip(skip)
                            .sort({_id: order})
                            .limit(limit);
                            
                            


        if(!estate) return res.status(404).send(new Error('Failed to retrive Estates'))

        res.send(estate);

})
Router.get('/estate/:id', async(req, res)=>{

    const id =  req.params.id;
    const estate = await Estate.findOne({_id:id});

    if(!estate) return res.status(404).send('Estate not found');

    res.status(200).send(estate)

})

Router.get('/properties',  async(req, res)=>{

    let skip = parseInt(req.query.start);
    let limit = parseInt(req.query.limit);
    let order = parseInt(req.query.order);
    const property = await Property.find()
                            .skip(skip)
                            .sort({_id: order})
                            .limit(limit);
                            
                            


        if(!property) return res.status(404).send(new Error('Failed to retrive properties'))

        res.send(property);

})

Router.get('/plot/search',  async(req, res)=>{

    let state = (req.query.state);
    let lga = (req.query.lga);
    let radius= parseInt(req.query.radius);
    let landType= req.query.landType;
    let sizeMin =parseInt(req.query.sizeMin);
    let sizeMax =parseInt(req.query.sizeMax);
    let priceMin =parseInt(req.query.sizeMin);
    let priceMax =parseInt(req.query.sizeMax);

    const plot = await Plot.find({"estate.alias": state, 
                                          "estate.lga":lga,
                                          "radius": {$in:radius},
                                          "plotType":landType,
                                          "size":{$lte:sizeMax, $gte:sizeMin},
                                          "price":{$ltw:priceMax, $gte:priceMin}
                                                            

                                        })
                            .populate('estate')           
                        
                            
                            


        if(!plot) return res.status(404).send(new Error('Plot not found'))

        res.send(plot);

})

Router.get('/property/search',  async(req, res)=>{

    console.log("passing nothing",req.query)

    let state = (req.query.state);
    let lga = (req.query.lga);
    let radius= parseInt(req.query.radius);


    let propertyType= req.query.propertyType;
    let name= req.query.name;
    let  bedrooms= req.query.bedrooms;
    let bathrooms= req.query.bathrooms;
    let sizeMin =parseInt(req.query.sizeMin);
    let sizeMax =parseInt(req.query.sizeMax);
    let priceMin =parseInt(req.query.priceMin);
    let priceMax =parseInt(req.query.priceMax);

    const property = await Property.find({"estate_state": state, 
                                          "estate_lga":lga,
                                          "radius": {$lte:radius},
                                          "propertyType":propertyType,
                                          "size":{$lte:sizeMax, $gte:sizeMin},
                                          "price":{$lte:priceMax, $gte:priceMin},
                                           "estate_name":name,
                                           "bedrooms":{$eq: bedrooms},
                                           "toilets":{$eq: bathrooms}
                                                            

                                        })
                            .populate('estate')     
                            
                                
                        
                            
                            


        if(!property) return res.status(404).send(new Error('Property  not found'))

        res.send(property);

})
Router.get('/property/:id', async(req, res)=>{

    const id =  req.params.id;
    const property = await Property.findOne({_id:id});

    if(!property) return res.status(404).send('Property not found');

    res.status(200).send(property)

})

Router.get('/plots',  async(req, res)=>{

    let skip = parseInt(req.query.start);
    let limit = parseInt(req.query.limit);
    let order = parseInt(req.query.order);
    const plot = await Plot.find()
                            .skip(skip)
                            .sort({_id: order})
                            .limit(limit);
                            
                            


        if(!plot) return res.status(404).send(new Error('Failed to retrive plot'))

        res.send(plot);

})
Router.get('/plot/:id', async(req, res)=>{

    const id =  req.params.id;
    const plot = await Plot.findOne({_id:id});

    if(!plot) return res.status(404).send('Plot not found');

    res.status(200).send(plot)

})

Router.get('/logout',auth,  async(req, res)=>{

    
    
    const result = await req.user.deleteToken(req.token);
 
   if(!result) return res.status(400).send('Failed to logout')

    res.status(200).send('Ok')
    
})

Router.get('/auth', auth, (req, res)=>{
 res.status(200).send({
     isAuth:true,
     id:req.user._id,
     email: req.user.email,
     name:req.user.name
 })
})
module.exports = Router;