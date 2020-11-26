const mongoose = require('mongoose');
const Joi = require('joi');
const { boolean } = require('joi');

const messageModel = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim: true
    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    body:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:Boolean,
        default:false
    },
    seen:{
        type:Boolean,
        default:false,
    },
    admin:{
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required:true
    }

})

const validateInput = (userInputs) =>{
    const schema = Joi.object({
  
      email:Joi.string().email().required(),
      subject:Joi.string().required(),
      body:Joi.string().required(),
      status:Joi.boolean()
    });
  
    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
  
  }


const Message = mongoose.model('Message', messageModel);

module.exports.Message = Message
module.exports.validateInput = validateInput;