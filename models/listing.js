var mongoose = require("mongoose");

var listingSchema = new mongoose.Schema({
   //_id filed is automatic in mongo
   name: String,
   image: String,
   description: String,
   price: Number, //mongodb does not have float
   category: String,
   status: String,
   timeCreated: Date,
   adminid: Number,
   // category:{
   //    id: {
   //       type: mongoose.Schema.Types.ObjectId,
   //       ref: "Category"
   //    },
   //    category: String
   // },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   messages: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Message"
      }
   ]
});

module.exports = mongoose.model("Listing", listingSchema);