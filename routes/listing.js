const express=require("express");
const mongoose = require("mongoose");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema,reviewSchema } = require('../Schema.js');
const {isLoggedIn,isOwner,validateListing}=require("../middlewares/isLoggedin.js")
const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })


const router=express.Router();
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,upload.single('listing[image]'), validateListing,wrapAsync(listingController.newListing))

    


//Add new Listing (GET)
router.get("/new",isLoggedIn, listingController.renderNewForm)


router.route("/:id").get(wrapAsync(listingController.showListing))
.put(isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.editListing))
.delete(isOwner,isLoggedIn,wrapAsync(listingController.destroyListing));


//Edit Route (GET)
router.get("/:id/edit", isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm));


module.exports=router;