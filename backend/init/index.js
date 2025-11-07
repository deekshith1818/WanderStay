require("dotenv").config();

const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb+srv://root:KhVys0W5Yp4RNhuB@cluster0.ijjgfjy.mongodb.net/";

main()
.then(()=>{
    console.log("connected to DATABASE");
})
.catch((err)=>{
    console.log(err);
})


async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
      
      await Listing.deleteMany({}); // Clear existing data
      initData.data=initData.data.map((obj)=>({...obj,owner:'6864d8636864131bc25a895c'}));

      await Listing.insertMany(initData.data); // Insert new data
      console.log("Data was initialized successfully");
    } catch (err) {
      console.error("Error initializing database:", err);
    } finally {
      mongoose.connection.close(); // Close the connection after operations
    }
  };
initDB();
