const userModel = require("../models/user-model");
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// Register User
module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;
        let user = await userModel.findOne({ email: email });
        
        if (user) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/");  // Add return to stop further execution
        }
        
        // Generate salt and hash password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err.message);
                return res.send("Error in generating salt");  // Handle error for genSalt
            }
            
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.send(err.message);
                } else {
                    try {
                        // Create the user in the database
                        let user = await userModel.create({
                            email,
                            password: hash,
                            fullname
                        });
                        
                        let token = generateToken(user);
                        res.cookie("token", token);
                        return res.send("User created successfully");  // Add return
                    } catch (error) {
                        console.log(error.message);
                        return res.send("Error in user registration");
                    }
                }
            });
        });
    } catch (err) {
        console.log(err.message);
        return res.send("Server error");
    }
};

// Login User
module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email });

        if (user) {
            // Compare the password
            bcrypt.compare(password, user.password, async (err, result) => {
                if (err) {
                    console.log(err.message);
                    return res.send("Error during password comparison");
                }

                if (result) {
                    user.usertype = "user";
                    await user.save();
                    
                    let token = generateToken(user);
                    res.cookie("token", token);
                    return res.redirect("/shop");  // Add return
                } else {
                    req.flash("error", "Email or password incorrect");
                    return res.redirect("/");  // Add return
                }
            });
        } else {
            req.flash("error", "Email or password incorrect");
            return res.redirect("/");  // Add return
        }
    } catch (err) {
        console.log(err.message);
        return res.send("Server error");
    }
};

// Logout User
module.exports.logout = async (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });  // Set the cookie to expire
    return res.redirect("/");  // Add return
};
