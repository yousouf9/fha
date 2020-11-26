const jwt = require('jsonwebtoken');
const {Admin} = require('../Models/adminModel');

module.exports = async (req, res, next)=> {
    let token = req.cookies['x-auth-admin']


    if(!token) return res.status(403).send({
        error:true,
        message: "You don't have the right permission to accesss here"

    })

    let decoded = await Admin.findByToken(token);

    if(!decoded) return res.status(400).send("Invalid Token");


    const admin = await Admin.findOne({_id: decoded.id, token})
                             .populate('group')

                       
    
        if(!admin) return res.status(400).send({
            error:true,
            message:"Not a valid administrator"
        })
        
        req.token = token;
        req.admin = admin;

        
        next()
}