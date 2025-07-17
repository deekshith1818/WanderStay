const Listing = require('../models/listing')

const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });

}

module.exports.newListing = async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"...",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();

    req.flash("success", "New Listing successfully Created!")
    res.redirect("/listings");
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const listing = await Listing.findById(id).populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate("owner");
        if (!listing) {
            req.flash("error", "Listing you are requested for does not exist");
            res.redirect("/listings")
        }
        console.log(listing);
        res.render("listings/show", { listing });
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const listing = await Listing.findById(id);
       if (!listing) {
            req.flash("error","Listing you are requested for does not exist");
            res.redirect("/listings")
        }

        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
        res.render("listings/edit", { listing,originalImageUrl});
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports.editListing=async (req, res) => {
    const { id } = req.params;
    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(req.file){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success"," Listing Updated Successfully!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!")
    console.log(deletedList);
    res.redirect("/listings");

}