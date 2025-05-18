import mongoose, { Mongoose } from "mongoose";
import { User } from "../models/user.model.js";

const getAllTeachers = async (req, res) => {
  let { page, pageSize } = req.query;

  page = parseInt(page, 10) || 1;
  pageSize = parseInt(pageSize, 10) || 10;

  try {
    const teachers = await User.aggregate([
      { 
  //role save in the lowercase or best apporache is save in numbers like 1 is for teacher 2 is for student
        $match: {
          role: "TEACHER",
        },
      },
      {
        $facet: {
          teachers: [
            {
              $skip: (page - 1) * pageSize,
            },
            {
              $limit: pageSize,
            },
            {
              $lookup: {
                from: "courses",
                let: { teacherId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$teachBy", "$$teacherId"],
                      },
                    },
                  },
                ],
                as: "totalCoursesAssigned",
              },
            },
            {
              $addFields: {
                totalCoursesAssigned: {
                  $size: "$totalCoursesAssigned",
                },
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
                totalCoursesAssigned: 1,
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $addFields: {
          totalPages: {
            $ceil: [
              {
                $divide: [
                  {
                    $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
                  },
                  pageSize,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          teachers: 1,
          totalPages: 1,
        },
      },
    ]);
  //teacher name and which courses teacher is teaching  if i click anish in the teachers table then list of coures 
  // anish is teaching.
  return   res
      .status(200)
      .json({ message: "Teachers fetched successfully.", data: teachers[0] });
  } catch (error) {
    console.log("Error while fetching teachers.", error);
    res
      .status(500)
      .json({ message: error.message || "Error while fetching teachers." });
  }
};

const getTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(teacherId),
        },
      },
      {
        $lookup: {
          from: "courses",
          let: { teacherId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$teachBy", "$$teacherId"],
                },
              },
            },
            {
              $addFields: {
                students: { $size: "$students" },
              },
            },
            {
              $project: {
                name: 1,
                students: 1,
                maxStudents: 1,
              },
            },
          ],
          as: "courses",
        },
      },
    ]);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.status(200).json({
      message: "Teacher fetched successfully.",
      data: teacher[0],
    });
  } catch (error) {
    console.log("Error while fetching teacher.", error);
    res
      .status(500)
      .json({ message: error.message || "Error while fetching teacher." });
  }
};

export { getAllTeachers, getTeacher };
