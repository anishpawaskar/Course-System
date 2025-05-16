import { Router } from "express";
import authRoutes from "./auth.route.js";
import courseRoutes from "./course.route.js";

const router = Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/courses", courseRoutes);

export default router;
