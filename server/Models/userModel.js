const mongoose = require('mongoose');
const bycrypt =  require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const SALT = 10;

const userSchema = new mongoose.Schema({
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
    lga: {
      type: String,
      required: true,
      trim:true
    },
    isActive: String,
    password:{
      type: String,
      required: true
    },
    roles: {
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
      },
    token:String,
    photo:{
      type:String,
      default:'noimage.png'
    },
    rememberMe:{
      type:Boolean,
      default:false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, {timestamps: true})


userSchema.methods.canPlayRoleOf = function(role) {
    if (role === "admin" && this.roles.admin) {
      return true;
    }

    if (role === "account" && this.roles.account) {
      return true;
    }

    return false;
  };
  userSchema.methods.defaultReturnUrl = function() {
    var returnUrl = '/';
    if (this.canPlayRoleOf('account')) {
      returnUrl = '/account/';
    }

    if (this.canPlayRoleOf('admin')) {
      returnUrl = '/admin/';
    }

    return returnUrl;
  };

  userSchema.statics.encryptPassword = async (password) => {

    const salt = await bycrypt.genSalt(SALT);
    return   await bycrypt.hash(password, salt)
  
  };
  userSchema.statics.validatePassword =async (password, hash) => {

    return await bycrypt.compare(password, hash);
  
  };
 
  
userSchema.methods.generateToken = (id, userType) =>{
      //Please hash the jwt token
    return jwt.sign({id:id, userType:userType}, config.get('jwtPrivate'));
}  

userSchema.statics.findByToken = (token) =>{
     //Please un-hash the jwt token 
    return jwt.verify(token, config.get('jwtPrivate'))
}

userSchema.methods.deleteToken = async (token) =>{
       let user = this;
   return await user.User.findOneAndUpdate({token:token},{$unset:{token: 1}},{new: true, useFindAndModify: false})
     

}


  const validateInput = (userInputs) =>{
    const schema = Joi.object({

      name:{

          first:Joi.string().required().max(100),
          last:Joi.string().required().max(100),
          middle:Joi.string().required().max(100)

      },
      email:Joi.string().email().required(),
      phone:Joi.string().required(),
      state:Joi.string().required(),
      lga:Joi.string().required(),
      password: Joi.string().alphanum().required(),

    });

    return schema.validate(userInputs, {abortEarly: false,  allowUnknown: true});

  }

  const User = mongoose.model('User', userSchema);


module.exports.User = User;
module.exports.validateInput = validateInput;