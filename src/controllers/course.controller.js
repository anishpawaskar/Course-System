import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { MAX_COURSES } from "../constants.js";

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
    const [teacher, course] = await Promise.all([
      User.findById(teacherId).select("role name"),
      await Course.findById(courseId).select("teachBy name"),
    ]);
    // const teacher = await User.findById(teacherId).select("role name");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    if (teacher.role !== "TEACHER") {
      return res
        .status(400)
        .json({ message: `Cannot assign a course to a role ${teacher.role}.` });
    }

    // const course = await Course.findById(courseId).select("teachBy name");

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.teachBy) {
      if (course.teachBy.equals(teacher._id)) {
        return res.status(400).json({
          message: `${teacher.name} is already assgined to ${course.name} course.`,
        });
      }
    }

    const totalTeachingCourses = await Course.countDocuments({
      teachBy: teacher._id,
    });

    if (totalTeachingCourses + 1 > MAX_COURSES) {
      return res
        .status(400)
        .json({ message: "Teacher can be assigned upto 5 courses." });
    }

    course.teachBy = teacherId;
    await course.save();

    return res
      .status(200)
      .json({ message: "Teacher assigned successfully.", data: course });
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
    const student = await User.findById(studentId).select("role");

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (student.role !== "STUDENT") {
      return res
        .status(400)
        .json({ message: `Cannot enroll a studnet with role ${student.role}` });
    }

    let courseQuery = {
      _id: new mongoose.Types.ObjectId(courseId),
    };

    if (user.role === "TEACHER") {
      courseQuery.teachBy = new mongoose.Types.ObjectId(user._id);
    }

    const course = await Course.findOne(courseQuery);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.students.includes(student._id)) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in this course." });
    }

    course.students.push(student._id);

    if (course.students.length >= course.maxStudents) {
      return res.status(400).json({
        message: `Maximum ${course.maxStudents} can be enroll to course.`,
      });
    }

    await course.save();

    return res.status(200).json({
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

const unrollStudent = async (req, res) => {
  const { courseId, studentId } = req.params;
  const user = req?.user;
  let course;

  try {
    if (user.role === "ADMIN") {
      course = await Course.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(courseId),
        },
        {
          $pull: {
            students: new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          new: true,
        }
      ).select("-__v");
    } else {
      course = await Course.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(courseId),
          teachBy: new mongoose.Types.ObjectId(user._id),
        },
        {
          $pull: { students: new mongoose.Types.ObjectId(studentId) },
        },
        { new: true }
      ).select("-__v -teachBy");
    }

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      message: "Unrolled successfully.",
      data: course,
    });
  } catch (error) {
    console.log("Error while unrolling student from course.", error);
    res
      .status(500)
      .json({ message: "Error while unrolling student from course." });
  }
};

const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    return res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.log("Error while deleting course.", error);
    res.status(500).json({ message: "Error while deleting course." });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      message: "Fetch courses successfully.",
      data: {
        courses,
      },
    });
  } catch (error) {
    console.log("Error while fetching all courses: ", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createCourse,
  assignTeacher,
  enrollStudent,
  unrollStudent,
  deleteCourse,
  getAllCourses,
};
