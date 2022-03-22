import express from "express";
import User from "../models/user.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import mongoose from "mongoose";
import Product from "../models/product.js";
import Chat from "../models/chat.js";
import Message from "../models/messages.js";

const router = new express.Router();
let db = mongoose.connection;

// Home Page

router.get("", async (req, res) => {
  const products = await Product.find({});
  res.render("index", { products: JSON.stringify(products) });
});

// Cart

router.get("/cart", async (req, res) => {
  const products = await Product.find({});
  res.render("cart", { products: JSON.stringify(products) });
});

// Register Message

router.get("/message", (req, res) => {
  res.render("message");
});

// User register

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    return res.redirect("/message");
  } catch (e) {
    res.status(400).send(e);
  }
});

// User Page

router.get("/user/me", userAuth, (req, res) => {
  if (req.user.role !== "admin") {
    res.render("userPage", {
      email: req.user.email,
      isAdmin: false,
    });
  } else {
    res.render("userPage", {
      email: req.user.email,
      isAdmin: true,
    });
  }
});

// List user

router.get("/user_list", adminAuth, async (req, res) => {
  const users = await User.find({});
  res.render("userList", {
    users,
    uId: req.user._id,
  });
});

// Login

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("access_token", token);
    res.redirect(`/user/me`);
  } catch (e) {
    res.send("Username or password is incorrect");
  }
});

// Logout

router.post("/logout", userAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("access_token");
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// Delete User

router.delete("/delete", userAuth, async (req, res) => {
  try {
    const id = req.user._id;
    await Chat.deleteOne({ id });
    await Message.deleteMany({ id });
    await req.user.remove();
    return res.redirect("/");
  } catch (e) {
    res.status(500).send();
  }
});

// Admin routers

// Create User

router.get("/create_user", (req, res) => {
  res.render("createUser");
});

router.post("/create_user", adminAuth, async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    return res.redirect("/user_list");
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update User

router.get("/update_user/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).orFail(new Error("incorrect id"));
    res.render("updateUser", {
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/update_user/:id", adminAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "role"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    const chat = await Chat.findOne({ id });
    updates.forEach((update) => {
      if (req.body[update] && req.body[update].length > 0)
        user[update] = req.body[update];
    });
    await user.save();
    chat.username = user.name;
    await chat.save();
    res.redirect("/user_list");
  } catch (e) {
    console.log("Error ", e);
    res.status(400).send(e);
  }
});

// Delete user

router.post("/delete_user", adminAuth, async (req, res) => {
  try {
    const id = req.body.uId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    }
    await Chat.deleteOne({ id });
    await Message.deleteMany({ id });
    await user.remove();
    res.redirect("/user_list");
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
