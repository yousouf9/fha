const dbDebug = require('debug')('App:db');
const errorhandler = require('./Middlewares/error');
                     require('express-async-errors');
const cookieParser = require('cookie-parser');
const winston = require('winston');
                require('winston-mongodb');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);
const config = require('config');
const serverDebug = require('debug')('App:server');
const express = require('express');
const mongoose =  require('mongoose');

const  multer = require('multer')
const cors = require('cors');


 mongoose.connect(config.get('hostname'), {useNewUrlParser: true, useUnifiedTopology: true})
      .then(()=> dbDebug('Connecting to mongodb...'))
      .catch(err => console.error('Could not connect to mongoDb..', err))

  
const app = express();

app.use(cors())

process.on('uncaughtException', (ex)=>{
    console.log('A FATAL ERROR UNCAUGHTEXCEPTION', ex)
    winston.error(ex.message, ex)
    process.exit(1)
})

process.on('unhandledRejection',  (ex)=>{

 console.log('A FATAL ERROR UNHANDLEEXCEPTION')
 winston.error(ex.message, ex)
 process.exit(1)


})


winston.add(new winston.transports.File({filename: 'logfile.log'}));
winston.add(new winston.transports.MongoDB({db: config.get('hostname')}));

//checking for Jsonwebtoken key
if(!config.get("jwtPrivate")){
    serverDebug('A FATAL ERROR jwtPrivate is requires', config.get('jwtPrivate'));
    process.exit(1);
  }


 const User = require('./Routes/user'); 
 const AdminGroup = require('./Routes/group');
 const Admin = require('./Routes/admin');
 const Estate = require('./Routes/estate')
 const Property = require('./Routes/property')
 const Plot = require('./Routes/plot')
 const Message = require('./Routes/message');
 const Notification = require('./Routes/notification');
 const Country = require('./Routes/country');
 const Contact = require('./Routes/contact');



 
//middleware

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})


app.use(express.json());
app.use(express.urlencoded({extended: true}))   
app.use(cookieParser());

app.use(express.static('client/build'))



app.use('/api', User);
app.use('/api/admin', AdminGroup);
app.use('/api/admin', Admin);
app.use('/api/admin', Estate);
app.use('/api/admin', Property);
app.use('/api/admin', Plot);
app.use('/api/admin', Message);
app.use('/api/admin', Notification);
app.use('/api/country', Country);
app.use('/api/contact', Contact);







if(process.env.NODE_ENV === 'production'){
    const path = require("path");
    app.get('/*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
}


app.use(errorhandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    serverDebug(`Listening at Port ${PORT}`);
})





