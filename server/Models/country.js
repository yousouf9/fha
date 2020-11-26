const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({

   state:{
       type:String,
       trim:true
   },
   alias:{
    type:String,
    trim:true
   },
   lgas:[String]
})

const Country = mongoose.model('Country', countrySchema);

module.exports.Country =   Country;