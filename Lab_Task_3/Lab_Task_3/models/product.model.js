const mongoose = require("mongoose");

let productSchema = mongoose.Schema
({
    title:String,
    description: String,
    price: Number,
});

let productModel = mongoose.model("product", productSchema);

module.exports = productModel;