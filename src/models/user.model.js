import mongoose from "mongoose";
import { ROLES } from "../constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (passowrd) {
  return await bcrypt.compare(passowrd, this.passowrd);
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    name: this.name,
    email: this.email,
    role: this.role,
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
  };

  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return token;
};

export const User = mongoose.model("User", userSchema);
