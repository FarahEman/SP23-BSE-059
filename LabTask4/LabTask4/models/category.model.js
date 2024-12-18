const mongoose = require("mongoose");

let CategorySchema = mongoose.Schema({
    name: String,
    description: String,
    image:String
});

let CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
