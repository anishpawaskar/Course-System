import { Router } from "express";
import { signinUser, signupUser } from "../controllers/auth.controller.js";
import {
  validateSigninUser,
  validateSignupUser,
} from "../middlewares/validators/auth.validator.js";

const router = Router();

router.post("/signup", validateSignupUser, signupUser);
router.post("/signin", validateSigninUser, signinUser);

export default router;
