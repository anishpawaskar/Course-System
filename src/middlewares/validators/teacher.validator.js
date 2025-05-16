import { Types } from "mongoose";
import { z } from "zod";

const validateGetTeacher = (req, res, next) => {
  const { teacherId } = req.params;

  const teacherIdSchema = z
    .string({
      required_error: "TeacherId is required.",
      invalid_type_error: "TeacherId must be a string.",
    })
    .refine((teacherId) => Types.ObjectId.isValid(teacherId), {
      message: "TeacherId is invalid ObjectId.",
    });

  const response = teacherIdSchema.safeParse(teacherId);

  if (response.success) {
    next();
  } else {
    const message = response.error.errors[0].message;
    res.status(400).json({ message });
  }
};

export { validateGetTeacher };
