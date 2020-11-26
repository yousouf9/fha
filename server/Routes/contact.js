const express = require('express');
const winston = require('winston');
const { Contact, validateInput} = require('../Models/contactModel');
const adminAuth = require('../Middlewares/adminAuth');
const { sendMail } = require('../utility/sendMail');




const Router = express.Router();


Router.post('/send', async(req, res)=>{

   
    const {error} = validateInput(req.body);
    console.log(error);

    if(typeof error !== 'undefined') return res.status(400).json({
        error: error,
          message:'Please fill out the contact form properly'})
    console.log(req.body);
    const contact = new Contact(req.body);

      if(!contact) return res.status(400).json({message:'Please fill out the contact form properly'}) 
 

      const result = await contact.save();

      if(!result) return res(400).json({message:'message not sent!'});


      sendNotificationEmail('info@fha.com', req.body.email, req.body.subject, req, res);

    

})

const sendNotificationEmail = (sender, to, subject, req, res) =>{


    const mailto = `${req.protocol}://${req.headers.host}`;
    const message = `<div>
                         <h2>Thank you for reaching us</h2>
                         <p>Thank you for contacting us, we will get back to you as soon as possible</p>
                         <p>Click <a href=${mailto}> here</a> to visit our website</p> 
                     </div>`
    
    sendMail(sender, to, subject, message, function(error, info){
    
 
     {
         if (error) {
           console.log(error);
           winston.error(error.message, error);
           res.status(400).json({
               message:'Message email fail to send',
               error: error
           })
   
 
         } else {
           console.log(`Notification send: ${info.response}`);
           res.status(200).json({
               success:true,
               message:{notify:"message sent!"}
           });
         }
       }
 
    });  



}

module.exports = Router;