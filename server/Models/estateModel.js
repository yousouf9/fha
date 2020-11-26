const Joi = require('joi');
const mongoose = require('mongoose');



const estateSchma = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    estateID:{
        type:String,
        required:true,
        unique:true,
    },
    state:{
        type:String,
        required:true
    },
    lga:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    latitude:{
        type:Number,
        default:0,
    },
    longitude:{
        type:Number,
        default:0,
    },
    photo:{
        type:String,
        default: 'asset.png'
    },
    status:{
        type:Boolean,
        default:false
    }


})


const validateInput = (userInputs) =>{
    const schema = Joi.object({
  
      name:Joi.string().required(),
      estateID:Joi.string().required(),
      state:Joi.string().required(),
      lga:Joi.string().required(),
      address: Joi.string().required(),
      status:Joi.boolean()
  
    });
  
    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
  
  }

const Estate = mongoose.model('Estate', estateSchma);

module.exports.Estate= Estate;
module.exports.validateInput= validateInput;