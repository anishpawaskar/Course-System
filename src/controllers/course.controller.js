import mongoose from "mongoose";
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

const assignTeacher = async (req, res) => {
  const { courseId, teacherId } = req.params;

  try {
    // TODO: assign teacher a course only if she have less than 5 courses at a time
    const updatedCourse = await Course.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(courseId),
      },
      {
        $set: {
          teachBy: teacherId,
        },
      },
      {
        new: true,
      }
    ).select("-__v");

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({
      message: "Teacher assigned successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    console.log("Error while assigning teacher to course.", error);
    res.status(500).json({
      message: error.message || "Error while assigning teacher to course.",
    });
  }
};

const enrollStudent = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  const user = req?.user;

  try {
    // TODO: ask shaqeeb how to perform check throw appropriate error and also think about what if user tries to add user who is ADMIN or TEACHER in student list
    let course;

    if (user.role === "ADMIN") {
      course = await Course.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(courseId),
        },
        {
          $push: { students: studentId },
        },
        {
          new: true,
        }
      );
    } else {
      course = await Course.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(courseId),
          teachBy: new mongoose.Types.ObjectId(user._id),
        },
        {
          $push: { students: studentId },
        },
        { new: true }
      );
    }

    if (!course) {
      return res.status(404).json({ message: "Couse not found." });
    }

    res.status(200).json({
      message: "Enrolled successfully.",
      data: course,
    });
  } catch (error) {
    console.log("Error while enrolling student.", error);
    res.status(500).json({
      message: "Error while enrolling student.",
    });
  }
};

export { createCourse, assignTeacher, enrollStudent };
