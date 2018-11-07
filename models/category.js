var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    //_id filed is automatic in mongo
   category: String
});

module.exports = mongoose.model("category", categorySchema);