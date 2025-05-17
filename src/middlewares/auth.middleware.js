import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers["accessToken"];

    if (!token) {
      return res.status(400).json({ message: "Unauthorize request." });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-__v -password -refreshToken"
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid access token." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error while validating token", error);
    res.status(500).json({ message: error.message || "Invalid access token." });
  }
};

const validateAdmin = (req, res, next) => {
  const user = req?.user;

  if (user.role === "ADMIN") {
    next();
  } else {
    return res
      .status(400)
      .json({ message: "You don't have permission to access this route." });
  }
};

const validateIsAdminOrTeacher = (req, res, next) => {
  const user = req?.user;

  if (["ADMIN", "TEACHER"].includes(user.role)) {
    next();
  } else {
    return res.status(400).json({
      message: "You don't have permission to access this route.",
    });
  }
};

export { verifyJWT, validateAdmin, validateIsAdminOrTeacher };
