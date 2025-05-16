import { User } from "../models/user.model.js";

const getAllTeachers = async (req, res) => {
  let { page, pageSize } = req.query;

  page = parseInt(page, 10) || 1;
  pageSize = parseInt(pageSize, 10) || 10;

  try {
    const teachers = await User.aggregate([
      {
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
            // TODO: add lookup later for fetching course assign count
            {
              $project: {
                name: 1,
                email: 1,
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

    res
      .status(200)
      .json({ message: "Teachers fetched successfully.", data: teachers[0] });
  } catch (error) {
    console.log("Error while fetching teachers.", error);
    res
      .status(500)
      .json({ message: error.message || "Error while fetching teachers." });
  }
};

export { getAllTeachers };
