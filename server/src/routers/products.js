import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();
const db = mongoose.connection;

// Create Product
router.get("/create_product", (req, res) => {
  res.render("createProducts");
});

router.get("/products", adminAuth, async (req, res) => {
  const products = await Product.find({});
  res.render("products", {
    products,
  });
});

router.post("/create_product", adminAuth, async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    return res.redirect("/products");
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

// Delete Product

router.post("/delete_product", adminAuth, async (req, res) => {
  try {
    const id = req.body.pId;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send();
    }
    await product.remove();
    res.redirect("/products");
  } catch (e) {
    res.status(500).send();
  }
});

// Update Product

router.get("/update_product/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).orFail(
      new Error("incorrect id")
    );
    res.render("updateProduct", {
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/update_product/:id", adminAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "image", "price"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    updates.forEach((update) => {
      if (req.body[update] && req.body[update].length > 0)
        product[update] = req.body[update];
    });
    await product.save();

    res.redirect("/products");
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
