import { Router } from "express";
import { validateAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllTeachers } from "../controllers/teacher.controller.js";
import { assignTeacher } from "../controllers/course.controller.js";

const router = Router();

router.get("/", verifyJWT, validateAdmin, getAllTeachers);

router.post(
  "/:teacherId/courses/:courseId",
  verifyJWT,
  validateAdmin,
  assignTeacher
);

export default router;
