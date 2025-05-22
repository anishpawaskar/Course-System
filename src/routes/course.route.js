import { Router } from "express";
import {
  validateAdmin,
  validateIsAdminOrTeacher,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  createCourse,
  deleteCourse,
  enrollStudent,
  getAllCourses,
  unrollStudent,
} from "../controllers/course.controller.js";
import { validateCreateCourse } from "../middlewares/validators/course.validator.js";

const router = Router();

router.post("/", verifyJWT, validateCreateCourse, createCourse);
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
router.delete("/:courseId", verifyJWT, validateAdmin, deleteCourse);
router.get("/", verifyJWT, getAllCourses);

export default router;
