const mongoose = require('mongoose');
const Joi = require('joi');

const notificationModel = new mongoose.Schema({

    message:{
        type:mongoose.Types.ObjectId,
        ref:"Message"
    },
    email:{
     type:String,
     required: true
    },
    status:{
        type:Boolean,
        default:false
    },
    seen:{
        type:Boolean,
        default:false
    }
    
})

const validateInput = (userInputs) =>{
    const schema = Joi.object({
  
      message:Joi.objectid(),
      status:Joi.boolean(),
      seen:Joi.boolean(),
      email:Joi.string().email().required(),
    });
  
    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
  
  }


const Notification = mongoose.model('Notification', notificationModel);

module.exports.Notification = Notification
module.exports.validateNotication = validateInput;