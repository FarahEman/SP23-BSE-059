const multer = require("multer");
const express = require("express");
let router = express.Router();
let Category = require("../../models/category.model");

// Set up Multer to store files in memory (or use disk storage)
const storage = multer.memoryStorage(); // Files will be stored in memory temporarily
const upload = multer({ storage }); // Initialize Multer with memory storage

// Get all categories with pagination, search, and sorting
router.get("/admin/categories", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
    const search = req.query.search || ""; // Search query
    const sortBy = req.query.sortBy || "name"; // Default sorting by name
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Sort order (ascending/descending)

    // Build the filter query based on search
    const filter = search ? { name: { $regex: search, $options: "i" } } : {}; // Case-insensitive search

    // Calculate the total number of categories
    const totalRecords = await Category.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize); // Total pages for pagination

    // Fetch the categories with pagination, sorting, and filtering
    const categories = await Category.find(filter)
      .sort({ [sortBy]: sortOrder }) // Sorting
      .skip((page - 1) * pageSize) // Pagination (skip previous pages)
      .limit(pageSize); // Limit results per page

    return res.render("admin/categories", {
      layout: "adminlayout",
      pageTitle: "Manage Shan Categories",
      categories,
      currentPage: page,
      totalPages,
      totalRecords,
      search,
      sortBy,
      sortOrder,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).send("An error occurred while fetching categories.");
  }
});

// Render form to create a category
router.get("/admin/categories/create", (req, res) => {
  return res.render("admin/categories-form", { layout: "adminlayout" });
});

// Create a category with file upload
router.post(
  "/admin/categories/create",
  upload.single("image"), // Use multer middleware to handle file upload
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      // Save the category to the database
      const newCategory = new Category({
        name: req.body.name,
        description: req.body.description,
        image: req.file.path, // Path to uploaded file
      });

      await newCategory.save();
      return res.redirect("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).send("An error occurred while creating the category.");
    }
  }
);

// Delete a category
router.get("/admin/categories/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).send("An error occurred while deleting the category.");
  }
});

// Render form to edit a category
router.get("/admin/categories/edit/:id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    return res.render("admin/categories-edit-form", {
      layout: "adminlayout",
      category,
    });
  } catch (error) {
    console.error("Error fetching category for editing:", error);
    return res.status(500).send("An error occurred while fetching the category.");
  }
});

// Handle category edit with file upload
router.post(
  "/admin/categories/edit/:id",
  upload.single("image"), // Handle optional image upload
  async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).send("Category not found.");
      }

      // Update the fields from the request
      category.name = req.body.name;
      category.description = req.body.description;

      // Replace image if a new file is uploaded
      if (req.file) {
        category.image = req.file.path; // Updated with file path
      }

      await category.save();
      return res.redirect("/admin/categories");
    } catch (error) {
      console.error("Error editing category:", error);
      return res.status(500).send("An error occurred while updating the category.");
    }
  }
);

module.exports = router;
