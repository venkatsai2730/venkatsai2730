const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require('config');

mongoose
.connect(`${config.get("MONGODB_URL")}`)
.then(function(){
    dbgr("connected");
    console.log("connected")
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;