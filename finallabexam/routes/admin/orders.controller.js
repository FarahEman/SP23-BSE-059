const express = require("express");
const router = express.Router();
const Order = require("../../models/order.model");

// Display orders in admin panel
router.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).populate("items.product");
    res.render("admin/orders", {
      layout: "adminlayout",
      pageTitle: "Manage Orders",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("An error occurred while fetching orders.");
  }
});

module.exports = router;
