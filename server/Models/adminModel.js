const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const bycrypt = require('bcrypt');
const SALT = 10;

const adminSchema = new mongoose.Schema({
     name:{
        first:{
        type: String,
        required:true,
        maxlength: 100,
        trim: true

        },
        last:{
          type: String,
          required:true,
          maxlength: 100,
          trim: true

      },
      middle:{
        type: String,
        maxlength: 100,
        default:'',
        trim: true

    },
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    phone:{
        type: String,
        required: true,
        max: 11
    },
    state:{
        type: String,
        required: true,
        trim:true
      
    },
    staffID:String,
    designation:String,
    photo:{
      type:String,
      default:'noimage.png'
    },
    rememberMe:{
      type:Boolean,
      default:false
    },
    isActive: String,
    token: String,
    password:{
      type: String,
      required: true
    },
    createdBy:String,
    group: { type: String, ref: 'AdminGroup', required: true },
    permissions: [{
      name: String,
      permit: Boolean
    }]
}, {timestamps: true});


adminSchema.statics.encryptPassword = async (password) => {

  const salt = await bycrypt.genSalt(SALT);
  return   await bycrypt.hash(password, salt)

};
adminSchema.statics.validatePassword =async (password, hash) => {

  return await bycrypt.compare(password, hash);

};
adminSchema.methods.generateToken = (id,  group) =>{
  //Please hash the jwt token
return jwt.sign({id, group}, config.get('jwtPrivate')); 
}  

adminSchema.statics.findByToken = (token) =>{
  //Please un-hash the jwt token 
 return jwt.verify(token, config.get('jwtPrivate'))
}

adminSchema.methods.deleteToken = async (token) =>{

return await this.Admin.findOneAndUpdate({token:token},{$unset:{token: 1}},{new: true, useFindAndModify: false})


}

adminSchema.methods.hasPermissionTo = function(something) {
  //check group permissions
  var groupHasPermission = false;
  /* for (var i = 0 ; i < this.groups.length ; i++) {
    for (var j = 0 ; j < this.groups[i].permissions.length ; j++) {
      if (this.groups[i].permissions[j].name === something) {
        if (this.groups[i].permissions[j].permit) {
          groupHasPermission = true;
        }
      }
    }
  } */

  for(let i=0; i<this.group.permissions.length; i++){
    if(this.group.permissions[i].name===something){
      if(this.group.permissions[i].permit){
        groupHasPermission = true;
      }
    }
  }
  //check admin permissions
  for (var k = 0 ; k < this.permissions.length ; k++) {
    if (this.permissions[k].name === something) {
      if (this.permissions[k].permit) {
        return true;
      }

      return false;
    }
  }

  return groupHasPermission;
};
adminSchema.methods.isMemberOf = function(group) {
  for (var i = 0 ; i < this.groups.length ; i++) {
    if (this.groups[i]._id === group) {
      return true;
    }
  }

  return false;
};

const Admin = mongoose.model('Admin', adminSchema);


const validateInput = (userInputs) =>{
  const schema = Joi.object({

    name:{
        first:Joi.string().required().max(100),
        last:Joi.string().required().max(100),
        middle:Joi.string().required().max(100),
    },
    email:Joi.string().email().required(),
    phone:Joi.string().required(),
    state:Joi.string().required(),
    password: Joi.string().alphanum().required(),
    createdBy:Joi.objectid()

  });

  return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});

}
module.exports.Admin = Admin;
module.exports.validateInput = validateInput;