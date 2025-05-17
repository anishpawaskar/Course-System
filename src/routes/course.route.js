import { Router } from "express";
import {
  validateAdmin,
  validateIsAdminOrTeacher,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  createCourse,
  enrollStudent,
  unrollStudent,
} from "../controllers/course.controller.js";
import { validateCreateCourse } from "../middlewares/validators/course.validator.js";

const router = Router();

router.post("/", verifyJWT, validateAdmin, validateCreateCourse, createCourse);
router.post(
  "/:courseId/enrollments",
  verifyJWT,
  validateIsAdminOrTeacher,
  enrollStudent
);
router.delete(
  "/:courseId/enrollments/:studentId",
  verifyJWT,
  validateIsAdminOrTeacher,
  unrollStudent
);

export default router;
