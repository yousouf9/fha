const Joi = require('joi');
const mongoose = require('mongoose');



const propertySchma = new mongoose.Schema({

    estate:{
        type:mongoose.Types.ObjectId,
        ref: "Estate",
        required: true
    },
    propertyType:{
        type: String,
        default:''
       },
    propertyID:{
        type:String,
        required:true
    },
    bedrooms:{
     type: String,
     default:''
    },
    toilets:{
        type: String,
        default:''
       },
    livingRooms:{
        type: String,
        default:''
       },
    diningRooms:{
        type: String,
        default:''
       },
    size:{
        type: Number,
        default:0
       },
    photos:[String],
    radius:{
        type: Number,
        default:0
       },
    price:{
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
    features:{
        parking:{
            type: Boolean,
            default:false
        },
        gym:{
            type: Boolean,
            default:false
        },
        security:{
            type: Boolean,
            default:false
        },
        recreation:{
            type: Boolean,
            default:false
        },
        sports:{
            type: Boolean,
            default:false
        }
        
    }

})

const validateInput = (userInputs) =>{
    const schema = Joi.object({
  
      propertyID:Joi.string(),
      propertyType:Joi.string(),
      bedrooms:Joi.string(),
      toilets:Joi.string(),
      livingRooms: Joi.string(),
      diningRooms:Joi.string(),
      size:Joi.number(),
      price:Joi.number(),
      photo:Joi.string(),
      features:{
          parking:Joi.boolean(),
          gym:Joi.boolean(),
          security:Joi.boolean(),
          recreation:Joi.boolean(),
          sports:Joi.boolean()
      }
  
    });
  
    return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});
  
  }


const Property = mongoose.model('Property', propertySchma);

module.exports.Property= Property;
module.exports.validateInput= validateInput;