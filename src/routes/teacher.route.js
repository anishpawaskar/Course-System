import { Router } from "express";
import { validateAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllTeachers,
  getTeacher,
} from "../controllers/teacher.controller.js";
import { assignTeacher } from "../controllers/course.controller.js";
import { validateGetTeacher } from "../middlewares/validators/teacher.validator.js";
import { validateAssignTeacher } from "../middlewares/validators/course.validator.js";

const router = Router();

router.get("/", verifyJWT, validateAdmin, getAllTeachers);
router.get(
  "/:teacherId",
  verifyJWT,
  validateAdmin,
  validateGetTeacher,
  getTeacher
);

router.post(
  "/:teacherId/courses/:courseId",
  verifyJWT,
  validateAdmin,
  validateAssignTeacher,
  assignTeacher
);

export default router;
