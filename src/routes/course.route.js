import { Router } from "express";
import { validateAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createCourse } from "../controllers/course.controller.js";
import { validateCreateCourse } from "../middlewares/validators/course.validator.js";

const router = Router();

router.post("/", verifyJWT, validateAdmin, validateCreateCourse, createCourse);

export default router;
