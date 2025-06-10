const User = require("../models/user");

module.exports.renderSignUpForm = (req ,res )=> {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req ,res ) => {
    try {
    let {username , email , password} = req.body;
    const newUser = new User({username , email});
    const registerUser =await User.register(newUser , password);
    req.login(registerUser , (err) =>{
        if (err) {
            next(err);
        }
         req.flash("success" , "Welcome to the site!");
         res.redirect("/listings");
    });
    } catch(error) {
        req.flash("error" , error.message);
        res.redirect("/signup");
    };
};

module.exports.renderLoginForm = (req ,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req , res )=> {
    req.flash("success" , "Welcome back!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);    
};

module.exports.logout = (req ,res , next)=> {
    req.logout((err) => {
        if(err) {
        return next(err);
     } 
     req.flash("success", "Logged out!");
    res.redirect("/listings");
    });
};