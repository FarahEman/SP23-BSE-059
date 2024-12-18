const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");

// Display checkout form
router.get("/checkout", (req, res) => {
  res.render("checkout", { pageTitle: "Checkout" });
});

// Handle checkout form submission
router.post("/checkout", async (req, res) => {
  try {
    const { customerName, street, city, postalCode, cartItems, totalAmount } = req.body;

    if (!customerName || !street || !city || !postalCode) {
      return res.status(400).send("All fields are required.");
    }

    const items = JSON.parse(cartItems);

    const newOrder = new Order({
      customerName,
      address: { street, city, postalCode },
      items,
      totalAmount,
    });

    await newOrder.save();
    res.redirect("/thank-you"); // Redirect to a thank-you page (optional)
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("An error occurred while placing the order.");
  }
});

module.exports = router;
