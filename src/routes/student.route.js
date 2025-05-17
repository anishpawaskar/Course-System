import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getStudent } from "../controllers/student.controller.js";

const router = Router();

router.get("/:studentId", verifyJWT, getStudent);

export default router;
