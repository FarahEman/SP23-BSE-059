const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Models
const Cart = require("./models/cart");
const Order = require("./models/order");
const Product = require("./models/product.model");

dotenv.config({ path: ".env.local" });

const server = express();

// ---------------- Middleware ---------------- //

server.set("view engine", "ejs");
server.use(expressLayouts);

server.set("layout", "layouts/layout");

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

// Automatically set activeLink based on URL path
server.use((req, res, next) => {
  res.locals.activeLink = req.path;
  next();
});

// ---------------- MongoDB Connection ---------------- //

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

// ---------------- Routes ---------------- //

// Home route
server.get("/", (req, res) => {
  return res.render("index2", { pageTitle: "Home" });
});

// ---------------- Cart Routes ---------------- //

// Add product to cart
server.post("/cart/add", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    let cart = await Cart.findOne(); // Assuming a single cart for simplicity
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity), price: product.price });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product to cart");
  }
});

// View cart
server.get("/cart", async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");
    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching cart");
  }
});

// Remove product from cart
server.post("/cart/remove/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== id);
    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error removing item from cart");
  }
});

// ---------------- Order Routes ---------------- //

// Place order
server.post("/cart/add", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    let cart = await Cart.findOne(); // Assuming a single cart for simplicity
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity), price: product.price });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product to cart");
  }
});

server.post("/cart/add", async (req, res) => {
  console.log(req.body);  // Add this to check if data is being sent correctly
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    let cart = await Cart.findOne(); // Assuming a single cart for simplicity
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity), price: product.price });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product to cart");
  }
});


// View all orders
server.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").sort({ orderDate: -1 });
    res.render("orders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching orders");
  }
});

// Delete an order
server.post("/orders/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndDelete(id);
    res.redirect("/orders");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting order");
  }
});

// ---------------- Start Server ---------------- //

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
