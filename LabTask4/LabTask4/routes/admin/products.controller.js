const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");
let Category = require("../../models/category.model");

router.get('/admin/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Get current page, default to 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
    const search = req.query.search || '';  // Get search query
    const category = req.query.category || '';  // Get category filter
    const minPrice = req.query.minPrice || '';  // Get minimum price filter
    const maxPrice = req.query.maxPrice || '';  // Get maximum price filter
    const sortBy = req.query.sortBy || 'createdAt';  // Default sorting by creation date
    const sortOrder = req.query.sortOrder || 'asc';  // Default sort order

    // Build the filter query
    const filter = {};
    if (category) filter.category = category;
    if (minPrice && maxPrice) filter.price = { $gte: minPrice, $lte: maxPrice };
    if (search) filter.$text = { $search: search };

    // Build the sort query
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Count total records matching the filter
    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);  // Calculate total pages

    // Fetch products with the filter, sorting, and pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('category');  // Populate category details if needed

    // Fetch categories for the filter dropdown
    const categories = await Category.find();

    // Render the products page with the fetched data and dynamic pageTitle
    res.render('admin/products', {
      layout: 'adminlayout',
      pageTitle: 'Manage Products',  // Set the pageTitle dynamically
      products,
      categories, // Send categories for filtering
      currentPage: page,
      totalPages,
      totalRecords,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("An error occurred while fetching products.");
  }
});

module.exports = router;
