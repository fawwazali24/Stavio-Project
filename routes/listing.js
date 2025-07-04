const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage}); //multer will upload directly to cloud storage


//same path multiple fucntions
//index and create route
router.route("/")
.get(wrapAsync(listingController.index)) 
.post(  
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);


//New route
router.get("/new", isLoggedIn ,listingController.renderNewForm);

//search route
router.get("/search", wrapAsync(listingController.searchListing));

//Edit route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditform)
);

//show, update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing ))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync( listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));


module.exports = router;

