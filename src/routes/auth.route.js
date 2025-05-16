import { Router } from "express";
import { signupUser } from "../controllers/auth.controller.js";
import { validateSignupUser } from "../middlewares/validators/auth.validator.js";

const router = Router();

router.post("/signup", validateSignupUser, signupUser);

export default router;
