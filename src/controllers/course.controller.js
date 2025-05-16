import { Course } from "../models/course.model.js";

const createCourse = async (req, res) => {
  let { name, maxStudents } = req.body;

  maxStudents = parseInt(maxStudents, 10);

  try {
    const newCourse = await Course.create({
      name,
      maxStudents,
      createdBy: req.user?._id,
    });

    res
      .status(201)
      .json({ message: "Course created successfully.", data: newCourse });
  } catch (error) {
    console.log("Error while creating course.", error);
    res
      .status(500)
      .json({ message: error.message || "Error while creating course." });
  }
};

export { createCourse };
