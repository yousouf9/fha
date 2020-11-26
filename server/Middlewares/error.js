const winston = require('winston');
const serverDebug = require('debug')('App:server');

module.exports = function(err, req, res, next){
         serverDebug("500 error", err);
         winston.error(err.message, err);
         res.status(500).send('server error');
};