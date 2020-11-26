const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({

   name:{
       type:String,
       trim:true
   },
   email:{
    type:String,
    trim:true
   },
   subject:{
    type:String,
    trim:true
   },
   message:{
    type:String,
    trim:true
   }
})


const validateInput = (userInputs) =>{
    const schema = Joi.object({
  
      name:Joi.string().required(),
      email:Joi.string().email().required(),
      subject:Joi.string().required(),
      message:Joi.string().required(),
    });
  
    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
  
  }

const Contact = mongoose.model('Contact', contactSchema);

module.exports.Contact =   Contact;
module.exports.validateInput =   validateInput;

