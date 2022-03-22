import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Chat from "./chat.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password must not contain password");
        }
      },
    },
    role: {
      type: String,
      trim: true,
      default: "user",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    chatId: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "dynamicshop");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

userSchema.methods.getChatId = async function () {
  if (this.isAdmin()) {
    return "admin";
  } else {
    if (this.chatId) {
      return this.chatId;
    } else {
      const chat = new Chat({ id: this._id.toString(), username: this.name });
      this.chatId = chat._id.toString();
      await Promise.all([chat.save(), this.save()]);
      return this.chatId;
    }
  }
};

const User = mongoose.model("User", userSchema);

export default User;
