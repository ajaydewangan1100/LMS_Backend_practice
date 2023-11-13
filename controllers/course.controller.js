import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// get Courses controller
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    if (!courses) {
      return next(new AppError("Failed to fetch courses", 500));
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
      return next(new AppError("Course not found with given id", 400));
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

// create course
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
    });

    if (!course) {
      fs.rm(`uploads/${req.file.pathname}`);
      return next(new AppError("Course could not be created", 500));
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      fs.rm(`uploads/${req.file.pathname}`);
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (e) {
    return next(
      new AppError(
        e.message || "Some error occured while generating course",
        500
      )
    );
  }
};

// update course
const updateCourse = async (req, res, next) => {};

// delete course
const removeCourse = async (req, res, next) => {};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
};
