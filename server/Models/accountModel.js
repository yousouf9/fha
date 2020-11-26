const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const accountSchema = new mongoose.Schema({
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, default: '' }
      },
      isVerified: { type: Boolean, default: false },
      verificationToken: { type: String, default: '' },
      name: {
        first: { type: String, default: '' },
        middle: { type: String, default: '' },
        last: { type: String, default: '' },
        full: { type: String, default: '' }
      },
})

accountSchema.statics.sendEmailToken = (id) => {

    return tokenCode = jwt.sign({id:id}, config.get('jwtPrivate')); 
};

accountSchema.statics.verifyEmailToken = (emailToken) => {
  
      return emailToken = jwt.verify(emailToken, config.get('jwtPrivate')); 
};

const validateInput = (userInputs) =>{
  const schema = Joi.object({

    user:{
        id:Joi.objectid(),
        name:Joi.string().required().max(10), 
    }
  });

  return schema.validate(userInputs, {abortEarly: false, allowUnknown: true});

}


const Account = mongoose.model('Account', accountSchema);


module.exports.Account = Account;
module.exports.validateInput = validateInput;