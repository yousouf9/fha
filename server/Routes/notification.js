const express = require('express');
const winston = require('winston');
const { Message, validateInput } = require('../Models/messageModel');
const { Notification } = require('../Models/notificationModel');
const adminAuth = require('../Middlewares/adminAuth');
const { sendMail } = require('../utility/sendMail');




const Router = express.Router();


Router.delete('/delete/notification/:id', adminAuth, async(req, res)=>{

    const notify = await Notification.findOneAndRemove({_id:req.params.id, email: req.admin.email});
    if(!notify) return res.status(400).json({message: 'Notication not found'})

    res.status(200).json({
        success:true,
        result:notify
    })
    
})

Router.get('/find/notification/:id', adminAuth, async (req, res)=>{
   const notify = await Message.findOne({_id:req.params.id, email: req.admin.email})
                                .populate('message')
       if(!notify) return res.status(400).json({message: 'Message not found'})

       await Notification.findOneAndUpdate({_id:req.params.id, email:req.admin.email, status:false}, {
        $set:{
            status:true,
            seen:true
        }
      },{ new:true,useFindAndModify:false});

       res.status(200).json({
           success:true,
           result:notify
       })
})
Router.get('/find/my/nofications/', adminAuth, async(req, res)=>{

   await Notification.updateMany({email:req.admin.email, seen:false}, {
       $set:{
           seen:true
       }
    });

    let skip =parseInt(req.query.start);
    let order =parseInt(req.query.order);
    let limit =parseInt(req.query.limit);

    const notify = await Notification.find({email: req.admin.email})
                                 .populate({
                                     path:'message',
                                     populate:{
                                         path:'admin',
                                         select:'name'
                                     }
                                 })
                                
                                 .skip(skip)
                                 .sort(order)
                                 .limit(limit)
                                 


   if(!notify) return res.status(400).json({message: 'You have no messages'})
   res.status(200).json(notify)

   
    
})

Router.get('/find/notification/new/count', adminAuth, async (req, res)=>{

   

    const nofityCount = await Notification.find({email: req.admin.email, seen:false})
                                      .count();

          if(!nofityCount) return res.status(400).json({message: 'You have no new notification'})

         res.status(200).json({
             success: true,
             result: nofityCount
         }) 
})



module.exports = Router;