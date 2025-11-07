const Listing = require('../models/listing');
const mongoose = require("mongoose");
const axios = require('axios');

// Function to get coordinates from location string
async function getCoordinates(location) {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: location,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'WanderStay/1.0 (your-email@example.com)'
            }
        });

        if (response.data && response.data[0]) {
            return {
                type: 'Point',
                coordinates: [
                    parseFloat(response.data[0].lon),
                    parseFloat(response.data[0].lat)
                ]
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });

}

module.exports.newListing = async (req, res) => {
    try {
        const { location } = req.body.listing;
        const geoData = await getCoordinates(location);
        
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing({
            ...req.body.listing,
            geometry: geoData || {
                type: 'Point',
                coordinates: [78.4867, 17.3850] // Default to Hyderabad if geocoding fails
            },
            owner: req.user._id,
            image: { url, filename }
        });

        await newListing.save();
        req.flash("success", "New Listing successfully Created!");
        res.redirect(`/listings/${newListing._id}`);
    } catch (error) {
        console.error('Error creating listing:', error);
        req.flash("error", "Failed to create listing. Please try again.");
        res.redirect("/listings/new");
    }
};

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

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you are requested for does not exist");
            res.redirect("/listings")
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
        res.render("listings/edit", { listing, originalImageUrl });
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports.editListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { location } = req.body.listing;
        
        // Only fetch new coordinates if location changed
        const listing = await Listing.findById(id);
        if (listing.location !== location) {
            const geoData = await getCoordinates(location);
            if (geoData) {
                listing.geometry = geoData;
            }
        }
        
        // Update other fields
        listing.set(req.body.listing);
        
        // Handle image update if new file is uploaded
        if (req.file) {
            const { path: url, filename } = req.file;
            listing.image = { url, filename };
        }
        
        await listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error updating listing:', error);
        req.flash("error", "Failed to update listing. Please try again.");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.destroyListing = async (req, res) => {
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