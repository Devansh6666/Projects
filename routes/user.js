const express = require('express');
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/users.js");

// Signup route
router
.route("/signup")
.get( userController.renderSignUpForm)
.post( userController.signUp );


// Login route
router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl, 
    passport.authenticate("local" , {
    failureRedirect : "/login",
    failureFlash: true,
 }), 
   userController.login);

// Logout route
router.get("/logout" , userController.logout);

module.exports = router;