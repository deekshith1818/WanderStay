const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema,reviewSchema } = require('../Schema.js');

const ExpressError = require("../utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to add a new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{

    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
     const { id } = req.params;
    const listing = await Listing.findById(id);  
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to delete this content.");
        return res.redirect(`/listings/${id}`);

    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

module.exports.validateReview = (req, res, next) => {
       if (typeof req.body.review.rating === 'string') {
        req.body.review.rating = parseInt(req.body.review.rating);
    }
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

module.exports.isReviewAuthor=async(req,res,next)=>{
     const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);  
    if(res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to delete this review.");
        return res.redirect(`/listings/${id}`);

    }
    next();
}
