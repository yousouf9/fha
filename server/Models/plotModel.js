const { number } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');



const plotSchma = new mongoose.Schema({

    estate:{
        type:mongoose.Types.ObjectId,
        ref: "Estate",
        required: true
        
    },
    plotType:{
        type: String,
        default:''
       },
    plotID:{
        type:String
    },
    size:{
        type: Number,
        default:0
       },
    estate_state:{
        type: String,
        default:''
    }, 
    estate_lga:{
        type: String,
        default:''
    },
    estate_name:{
        type: String,
        default:''
    },  
    photo:[String],
    price:{
        type: Number,
        default:0
       },
     radius:{
         type:Number,
         default:0
     }  

})

const validateInput = (userInputs) =>{
    const schema = Joi.object({
  
      plotID:Joi.string(),
      plotType:Joi.string(),
      size:Joi.number(),
      price:Joi.number(),
      photo:Joi.string(),

    });
  
    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
  
  }


const Plot = mongoose.model('Plot', plotSchma);

module.exports.Plot= Plot;
module.exports.validateInput= validateInput;