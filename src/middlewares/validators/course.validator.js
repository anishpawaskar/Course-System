import { Types } from "mongoose";
import { z } from "zod";

const validateCreateCourse = (req, res, next) => {
  const { name, maxStudents } = req.body || {};

  const courseSchema = z.object({
    name: z.string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    }),
    maxStudents: z
      .number({
        required_error: "Max students count is required.",
        invalid_type_error: "Max students count must be a number.",
      })
      .min(10, { message: "Max students count should be between 10-30." })
      .max(30, { message: "Max students count should be between 10-30." }),
    createdBy: z.any().refine((userId) => Types.ObjectId.isValid(userId), {
      message: "Created by is invalid ObjectId.",
    }),
  });

  const response = courseSchema.safeParse({
    name,
    maxStudents: parseInt(maxStudents),
    createdBy: req.user._id,
  });

  if (response.success) {
    next();
  } else {
    const message = response.error.errors[0].message;
    res.status(400).json({ message });
  }
};

const validateAssignTeacher = (req, res, next) => {
  const { courseId, teacherId } = req.params;

  const courseSchema = z.object({
    courseId: z
      .string({
        required_error: "CourseId is required.",
        invalid_type_error: "CourseId must be a string.",
      })
      .refine((courseId) => Types.ObjectId.isValid(courseId), {
        message: "CourseId is invalid ObjectId.",
      }),
    teacherId: z
      .string({
        required_error: "TeacherId is required.",
        invalid_type_error: "TeacherId must be a string.",
      })
      .refine((teacherId) => Types.ObjectId.isValid(teacherId), {
        message: "TeacherId is invalid ObjectId.",
      }),
  });

  const resposne = courseSchema.safeParse({
    teacherId,
    courseId,
  });

  if (resposne.success) {
    next();
  } else {
    const message = response.error.errors[0].message;
    res.status(400).json({ message });
  }
};

export { validateCreateCourse, validateAssignTeacher };
