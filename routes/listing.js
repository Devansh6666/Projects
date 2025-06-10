const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudeConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({storage });

// Index and Create route
router
    .route("/")
    .get( wrapAsync(listingController.index))
     .post(isLoggedIn ,
        validateListing,
        upload.single("listing[image]"), 
      wrapAsync(listingController.createListing)
    );

// New  routes
router.get("/new" ,isLoggedIn, listingController.renderNewForm );

//  Show , Update , Delete  route
router
    .route("/:id")
    .get(validateListing, 
        wrapAsync(listingController.showListing))
    .put(isLoggedIn ,
        isOwner, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn ,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit route
router.get("/:id/edit" , 
    isLoggedIn ,
    isOwner ,
    validateListing, 
    wrapAsync(listingController.renderEdit));

router.get("/search/show" , (listingController.search));


module.exports = router;