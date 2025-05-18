import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
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

    const teacherCourseCount = await Course.countDocuments({ teachBy: teacherId });
    // if above code is not working then try this, cause teacherId is string and stored teachBy as moongoose id.
  //  const teacherCourseCount = await Course.countDocuments({ teachBy: new mongoose.Types.ObjectId(teacherId) });

    if (teacherCourseCount >= 5) {
      return res.status(400).json({
        message: "This teacher is already assigned to 5 courses.",
      });
    }
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
// aggregation not requried 
const enrollStudentNewApporch = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  const user = req?.user;

  try {
    
    // Step 1: Check if user exists and is a STUDENT
    const student = await User.findById(new mongoose.Types.ObjectId(studentId)).select("role");

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
   // still this apporch is not a good apporach we check the role through db create a collection role and permission then create a middleware of it,
   // then add middleware in every route and validate the role and permissions 
    if (student.role !== "STUDENT") {
      return res.status(400).json({ message: `Cannot enroll a Course with role ${student.role}.` });
    }

    // Step 2: Check if student is already enrolled
    const courseQuery = {
      _id: new mongoose.Types.ObjectId(courseId),
    };

    // If TEACHER, ensure the course is theirs
    if (user.role === "TEACHER") {
      courseQuery.teachBy = new mongoose.Types.ObjectId(user._id);
    }

    const course = await Course.findOne(courseQuery);

    if (!course) {
      return res.status(404).json({ message: "Course not found or you don't have access." });
    }

    if (course.students.includes(studentObjectId)) {
      return res.status(400).json({ message: "Student is already enrolled in this course." });
    }

    // Step 3: Enroll the student
    course.students.push(studentObjectId);
    await course.save();

  return  res.status(200).json({
      message: "Enrolled successfully.",
      data: course,
    });
  } catch (error) {
    console.log("Error while enrolling student:", error);
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
// exports.deleteCourse
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
//use exports directly from the function.
export {
  createCourse,
  assignTeacher,
  enrollStudent,
  unrollStudent,
  deleteCourse,
};
