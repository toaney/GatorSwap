var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    text: String,
    wasRead: Boolean,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    listing:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        }
    }
});

module.exports = mongoose.model("Message", messageSchema);