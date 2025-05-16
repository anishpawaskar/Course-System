import { Router } from "express";
import {
  signinUser,
  signoutUser,
  signupUser,
} from "../controllers/auth.controller.js";
import {
  validateSigninUser,
  validateSignupUser,
} from "../middlewares/validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", validateSignupUser, signupUser);
router.post("/signin", validateSigninUser, signinUser);
router.post("/signout", verifyJWT, signoutUser);

export default router;
