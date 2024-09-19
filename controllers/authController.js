const userModel = require("../models/user-model");
const bcrypt = require('bcryptjs');
<<<<<<< HEAD
=======

>>>>>>> db50c47cf411f4337df718056504a168c6b6dd01
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken")


module.exports.registerUser = async function (req, res){
    try{
        let {email, password, fullname} = req.body;
        let user= await userModel.findOne({email:email});
        if(user) {
            req.flash("error","You already have an account,please login");
            res.redirect("/");
        }
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, async(err, hash)=>{
                if(err)  return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password:hash,
                        fullname
                    });
               let token = generateToken(user);
               res.cookie("token",token);
               res.send("user created succesfully");
                }
            })
        })
     }
       catch(err){
      console.log(err.message);
       }
};

module.exports.loginUser = async (req,res) =>{
    let {email, password } = req.body;

   let user = await userModel.findOne({email:email,});
   
   if(user){
    bcrypt.compare(password,user.password,async (err,result)=>{
        if(result){
            user.usertype="user";
            await user.save();
            let token= generateToken(user);
            

            res.cookie("token",token);
            res.redirect("/shop");
          }
          else{
            req.flash("error","Email or password incorrect");
            res.redirect("/");
          }
    })
   }
   else{
    req.flash("error","Email or password incorrect");
    res.redirect("/");
   }
}

module.exports.logout = async (req,res) =>{
    res.cookie("token","");
    res.redirect("/");
}
