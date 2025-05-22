import { Router } from "express";
import authRoutes from "./auth.route.js";
import courseRoutes from "./course.route.js";
import teacherRoutes from "./teacher.route.js";
import studentRoutes from "./student.route.js";
import userRoutes from "./user.route.js";

const router = Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/courses", courseRoutes);
router.use("/api/v1/teachers", teacherRoutes);
router.use("/api/v1/students", studentRoutes);
router.use("/api/v1/users", userRoutes);

export default router;
