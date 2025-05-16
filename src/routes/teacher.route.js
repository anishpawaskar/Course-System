import { Router } from "express";
import { validateAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllTeachers } from "../controllers/teacher.controller.js";

const router = Router();

router.get("/", verifyJWT, validateAdmin, getAllTeachers);

export default router;
