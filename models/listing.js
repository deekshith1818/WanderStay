const mongoose = require("mongoose");
const Reviews=require("./review.js");
const { types, string } = require("joi");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title : {
        type :String,
        required : true
    },

    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Reviews"
    }],
    description : String,
    image: {
      url:String,
      filename:String
    },
    price : Number,
    location : String,
    country : String,
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;

