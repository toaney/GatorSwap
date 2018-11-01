var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AdminSchema = new mongoose.Schema({
    adminname: String,
    password: String,//
    email: String,//
});

AdminSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Admin", AdminSchema);