import express from "express";
import User from "../models/user.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import mongoose from "mongoose";
import Product from "../models/product.js";

const router = new express.Router();
let db = mongoose.connection;
// let urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get("", async (req, res) => {
  const products = await Product.find({})
  res.render("index", {products: JSON.stringify(products)});
})

router.get("/cart", async (req, res) => {
  const products = await Product.find({})
  res.render("cart", {products: JSON.stringify(products)})
})

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/create_user", (req, res) => {
  res.render('createUser')
})

router.get("/update_user/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id).orFail(new Error("incorrect id"))
    res.render('updateUser', {
    name: user.name,
    email: user.email,
    role: user.role
  })
  } catch (e) {
    res.status(400).send(e);
  }
  
})

router.get("/signin", (req, res) => {
  res.render("signin");
});

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

router.get("/user_list", adminAuth, async (req, res) => {
  const users = await User.find({});
  res.render("userList", {
    users,
    uId: req.user._id
  });
});

router.get("/message", (req, res) => {
  res.render("message");
});

router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    // res.status(201).send({ user, token })
    return res.redirect("/message");
  } catch (e) {
    res.status(400).send(e);
  }
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
    res.status(400).send();
  }
});

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

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     console.log(_id)
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.post('/users', adminAuth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         if (!users) {
//             return res.status(404).send()
//         }
//         res.redirect('/users')
//     } catch (e) {
//         res.send(e)
//     }
//   });

// router.get("/user/me", userAuth, async (req, res) => {
//   res.send(req.user);
// });

// router.patch("/users/me", userAuth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password", "role"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }
//   try {
//     // const user = await User.findById(req.params.id)
//     const user = req.user;
//     updates.forEach((update) => (user[update] = req.body[update]));
//     await user.save();

//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.delete("/delete", userAuth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)
    // if (!user) {
    //     return res.status(404).send()
    // }
    await req.user.remove();
    // res.send(req.user)
    return res.redirect("/");
  } catch (e) {
    res.status(500).send();
  }
});

// Admin routers

router.post("/create_user", adminAuth, async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    // res.status(201).send({ user, token })
    return res.redirect("/user_list");
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
    const id = req.params.id
    const user = await User.findById(id)
    updates.forEach((update) => {
      if (req.body[update] && req.body[update].length > 0) user[update] = req.body[update]
    });
    await user.save();

    res.redirect("/user_list");
  } catch (e) {
    console.log('Error ', e)
    res.status(400).send(e);
  }
});

router.post("/delete_user", adminAuth, async (req, res) => {
  try {
  const id = req.body.uId
  const user = await User.findById(id)
    if (!user) {
      return res.status(404).send()
    }
    await user.remove();
    res.redirect("/user_list")
  } catch (e) {
    res.status(500).send()
  }
});

export default router;
