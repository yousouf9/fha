const express = require('express');
const {Country} =require('../Models/country');

const Router = express.Router();

Router.get('/states',  async(req, res)=>{
   
    const state =  await Country.find()
                               .select('state alias');
        if(!state) return res.status(400).json({message: "failed to fetch states"})

        res.status(200).json({
            success:true,
            result: state
        })
});




Router.get('/state/:lga',  async(req, res)=>{
   
    const lgas =  await Country.findOne({state:req.params.lga})
                                 .select('lgas');
        if(!lgas) return res.status(400).json({message: "failed to fetch lgas"})

        res.status(200).json({
            success:true,
            result: lgas
        })
});

module.exports = Router;