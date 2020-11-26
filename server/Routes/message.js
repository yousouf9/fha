const express = require('express');
const winston = require('winston');
const { Message, validateInput } = require('../Models/messageModel');
const { Notification } = require('../Models/notificationModel');
const adminAuth = require('../Middlewares/adminAuth');
const { sendMail } = require('../utility/sendMail');




const Router = express.Router();


Router.post('/send/message', adminAuth, async(req, res)=>{

    const currentUser = await req.admin;

    const {error} = validateInput(req.body);
    if(typeof error !== 'undefined') return res.status(400).json({message:'Please fill out the message form properly'})

    const message = new Message(req.body);

      if(!message) return res.status(400).json({message:'Please fill out the message form properly'}) 
          //setting sender properties
          message.admin = currentUser._id;
      
     const notification = new Notification({
         message: message._id,
         email:req.body.email
     })

     if(!notification) return res(400).json({message:'message not sent failed to send notification'});

         await notification.save();

      const result = await message.save();

      if(!result) return res(400).json({message:'message not sent!'});


      sendNotificationEmail(currentUser.email, req.body.email, req.body.subject, currentUser.name, req, res);

    

})

Router.delete('/delete/message/:id', adminAuth, async(req, res)=>{

    const message = await Message.findOneAndRemove({_id:req.params.id, email: req.admin.email});
    if(!message) return res.status(400).json({message: 'Message not found'})

    res.status(200).json({
        success:true,
        result:message
    })
    
})

Router.get('/find/message/:id', adminAuth, async (req, res)=>{
   const message = await Message.findOne({_id:req.params.id, email: req.admin.email})
                                .populate({
                                    path:'admin',
                                        select:'name email phone -_id'
                                })
       if(!message) return res.status(400).json({message: 'Message not found'})


  await Message.findOneAndUpdate({_id:req.params.id, email:req.admin.email, status:false}, {
        $set:{
            status:true,
            seen:true
        }
      },{ new:true,useFindAndModify:false});

  

       res.status(200).json({
           success:true,
           result:message
       })
})
Router.get('/find/my/messages/', adminAuth, async(req, res)=>{

   await Message.updateMany({email:req.admin.email, seen:false}, {
       $set:{
           seen:true
       }
    });

    let skip =parseInt(req.query.start);
    let order =parseInt(req.query.order);
    let limit =parseInt(req.query.limit);

    const message = await Message.find({email: req.admin.email})
                                 .populate('admin')
                                 .skip(skip)
                                 .sort(order)
                                 .limit(limit)
                                 


   if(!message) return res.status(400).json({message: 'You have no messages'})
   res.status(200).json(
    message)

   
    
})

Router.get('/find/messages/new/count', adminAuth, async (req, res)=>{

    const messageCount = await Message.find({email: req.admin.email, seen:false})
                                      .count();

          if(!messageCount) return res.status(400).json({message: 'You have no new messages'})

         res.status(200).json({
             success: true,
             result: messageCount
         }) 
})

const sendNotificationEmail = (sender, to, subject, {first, last},req, res) =>{


    const mailto = `${req.protocol}://${req.headers.host}/administrator`;
    const message = `<div>
                         <h2>Notification from FHA</h2>
                         <p>Please login to your FHA account you have a new message from ${first} ${last}</p>
                         <a href=${mailto}>Login here</a>
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
               message:{notify:"notification sent to user email"}
           });
         }
       }
 
    });  



}

module.exports = Router;