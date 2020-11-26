const mongoose = require('mongoose');

const adminGroupSchema = new mongoose.Schema({
    _id: { type: String },
    name: { 
        type: String,
        enum:['super', 'stateAdmin', 'admin'],
     default: 'admin' },
     permissions: [{ name: String, permit: Boolean }]

})

const AdminGroup = mongoose.model('AdminGroup', adminGroupSchema);

module.exports.AdminGroup = AdminGroup;