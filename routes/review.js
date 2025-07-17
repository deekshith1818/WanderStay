const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require('../Schema.js');
const Listing = require("../models/listing.js");
const Reviews=require("../models/review.js")
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middlewares/isLoggedin.js")
const reviewController=require("../controllers/review.js")



router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview))

//DELETE REVIEW ROUTE


router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;
