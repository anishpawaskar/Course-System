import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const getStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $lookup: {
          from: "courses",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$studentId", "$students"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                let: { teacherId: "$teachBy" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$teacherId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      name: 1,
                      email: 1,
                    },
                  },
                ],
                as: "teachBy",
              },
            },
            {
              $addFields: {
                teachBy: {
                  $first: "$teachBy",
                },
              },
            },
            {
              $project: {
                name: 1,
                teachBy: 1,
              },
            },
          ],
          as: "courses",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          courses: 1,
        },
      },
    ]);

    res
      .status(200)
      .json({ message: "Student fetched successfully.", data: student });
  } catch (error) {
    console.log("Error while fetching student.", error);
    res.status(500).json({ message: "Error while fetching student." });
  }
};

export { getStudent };
