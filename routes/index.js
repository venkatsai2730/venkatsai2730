const express= require('express');
const router= express.Router();
const productSchema = require("../models/product-model");
const isloggedin = require("../middlewares/isLoggedIn");
const userModel = require('../models/user-model');


router.get("/", (req, res) => {
    let error = req.flash("error"); 
    res.render("index", { error,loggedin: false }); 
});

router.get("/shop", isloggedin, async (req,res)=>{
    let products = await productSchema.find();
    let success = req.flash("success");
    res.render('shop',{products,success});
})

router.get("/cart", isloggedin, async (req,res)=>{
  let user = await userModel
  .findOne({email: req.user.email})
  .populate("cart"); 
  
  const bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount);

  res.render('cart',{user,bill});
})
router.get("/addtocart/:id", isloggedin, async (req,res)=>{
  let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.id);
   await user.save();
   req.flash("success", "Added to cart");
   res.redirect("/shop");
})

module.exports = router;