import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";

// get Courses controller
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    if (!courses) {
      return next(new AppError("No courses fetched from database", 500));
    }

    res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      courses,
    });
  } catch (e) {
    return next(new AppError(e.message || "Error on getting courses", 500));
  }
};

// get lectures by course id
const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id", 400));
    }

    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfullly",
      lectures: course.lectures,
    });
  } catch (e) {
    return next(
      new AppError(e.message || "Error on getting course lectures", 500)
    );
  }
};

export { getAllCourses, getLecturesByCourseId };
