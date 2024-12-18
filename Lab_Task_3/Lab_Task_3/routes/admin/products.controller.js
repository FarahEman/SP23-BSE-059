const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");

router.get("/admin/products", async (req, res) => {
    let products = [{
        title:"My title",
        description: "My string",
        price: 5,
    }]
    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Shan Foods",
      products,
    });
  });

  router.get("/admin/products/create", (req, res) => {
    return res.render("admin/product-form", { layout: "adminlayout" });
  });

  router.post("/admin/products/create", async (req, res) => {
    let data = req.body;
    let newProduct = new Product(data);
    newProduct.title = data.title;
    await newProduct.save();
    return res.redirect("/admin/products");
  });

router.get("/admin/products/delete/:id", async(req,res)=>{
    let params = req.params;
    let product = await Product.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/products");
})

router.get("/admin/products/edit/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);
    return res.render("admin/product-edit-form", {
      layout: "adminlayout",
      product,
    });
});
router.post("/admin/products/edit/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    await product.save();
    return res.redirect("/admin/products");
  });
module.exports = router;