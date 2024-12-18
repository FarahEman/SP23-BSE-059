const express = require("express");
const expressLayouts = require("express-ejs-layouts"); // For layout management
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const server = express(); // Initialize the Express server

// ---------------- Middleware ---------------- //

// Set view engine to EJS
server.set("view engine", "ejs");

// Use express-ejs-layouts for layouts
server.use(expressLayouts);

// Set default layout file
server.set("layout", "layouts/layout"); // Ensure 'layout.ejs' exists in 'views/layouts'

// Serve static files from 'public' folder
server.use(express.static("public"));

// Middleware to parse URL-encoded data
server.use(express.urlencoded({ extended: true }));

// Middleware to dynamically set activeLink for navigation
server.use((req, res, next) => {
  res.locals.activeLink = req.path; // Automatically set activeLink based on URL path
  next();
});

// ---------------- Routes ---------------- //

// Home route
server.get("/", (req, res) => {
  return res.render("index2", { pageTitle: "Home" });
});

// Routes for admin products
const adminProductsRouter = require("./routes/admin/products.controller");
server.use("/admin/products", adminProductsRouter);

// Routes for admin categories
const adminCategoriesRouter = require("./routes/admin/categories.controller");
server.use("/admin/categories", adminCategoriesRouter);

// Routes for file upload testing
const testRouter = require("./routes/admin/test.controller");
server.use("/admin/test", testRouter);

// ---------------- MongoDB Connection ---------------- //

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

// ---------------- Start Server ---------------- //

const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
