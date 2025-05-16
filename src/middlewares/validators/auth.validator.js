import { z } from "zod";
import { ROLES } from "../../constants.js";

const validateSignupUser = (req, res, next) => {
  const { name, email, password, role } = req.body || {};

  const userSchema = z.object({
    name: z
      .string({
        required_error: "Name is required.",
        invalid_type_error: "Name must be a string.",
      })
      .trim(),
    email: z
      .string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a string.",
      })
      .email()
      .trim()
      .toLowerCase(),
    password: z
      .string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a string.",
      })
      .min(6, { message: "Password must be in between 6-64 characters." })
      .max(64, { message: "Password must be in between 6-64 characters." }),
    role: z.enum(ROLES, {
      required_error: "Role is required.",
      invalid_type_error: "Role must be either STUDENT, TEACHER, ADMIN",
    }),
  });

  const response = userSchema.safeParse({
    name,
    email,
    password,
    role,
  });

  if (response.success) {
    next();
  } else {
    const message = response.error.errors[0].message;
    res.status(400).json({ message });
  }
};

const validateSigninUser = (req, res, next) => {
  const { email, password } = req.body || {};

  const userShcema = z.object({
    email: z
      .string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a string.",
      })
      .email()
      .trim()
      .toLowerCase(),
    password: z
      .string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a string.",
      })
      .min(6, { message: "Password must be in between 6-64 characters." })
      .max(64, { message: "Password must be in between 6-64 characters." }),
  });

  const response = userShcema.safeParse({
    email,
    password,
  });

  if (response.success) {
    next();
  } else {
    const message = response.error.errors[0].message;
    res.status(400).json({ message });
  }
};

export { validateSignupUser, validateSigninUser };
