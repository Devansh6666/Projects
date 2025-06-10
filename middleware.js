const ExpressError = require("./utils/ExpressError");
const {listingSchema , reviewsSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


// Validation Listing
module.exports.validateListing = (req ,res ,next) => {
     let {error} =listingSchema.validate(req.body);
    if(error) {
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errmsg);
    }
    else {
        next();
    }
};

// Validate review
module.exports.validateReview = (req ,res ,next) => {
     let {error} =reviewsSchema.validate(req.body);
    if(error) {
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errmsg);
    }
    else {
        next();
    }
};

// LoggedId Authenticared
module.exports.isLoggedIn = (req ,res ,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','You must be logged in to do that');
        return  res.redirect('/login');
    };
    next();
};

module.exports.saveRedirectUrl =(req , res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Identific Owner
module.exports.isOwner = async (req ,res ,next) => {
    let {id} = req.params ;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUser._id)) {
        req.flash("error" , "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Review Owner
module.exports.isReviewAuthor = async (req ,res ,next) => {
    let { id, reviewId} = req.params ;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)) {
        req.flash("error" , "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};