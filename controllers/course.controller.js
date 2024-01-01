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
      thumbnail: {
        public_id: "DUMMY",
        secure_url: "DUMMY",
      },
    });

    if (!course) {
      return next(new AppError("Course could not be created", 500));
    }

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
        });

        if (result) {
          course.thumbnail.public_id = result.public_id;
          course.thumbnail.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
      } catch (e) {
        return next(new AppError(e.message || "Error on uploading media", 500));
      }
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
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log(course);
    if (!course) {
      return next(
        new AppError(e.message || "No course found with given id", 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Course updated succefully",
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

// delete course
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist.", 404));
    }

    await course.remove();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (e) {
    return next(
      new AppError(e.message || "Some error occured while deleting course", 500)
    );
  }
};

// add lectures on course by id
const addLectureToCourseById = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const { id } = req.params;

    if (!title || !description) {
      return next(new AppError("All fields requierd", 400));
    }

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course does't exist with given id", 400));
    }

    const lectureData = {
      title,
      description,
      lecture: {
        public_id: "DUMMY",
        secure_url: "DUMMY",
      },
    };

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms", // Save files in a folder named lms
          chunk_size: 50000000, // 50 mb size
          resource_type: "video",
        });

        if (result) {
          lectureData.lecture.public_id = result.public_id;
          lectureData.lecture.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
      } catch (e) {
        return next(new AppError(e.message || "Error on uploading media", 500));
      }
    }

    course.lectures.push(lectureData);

    course.numberOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture successfully added to the course",
      course,
    });
  } catch (e) {
    return next(
      new AppError(e.message || "Error on creating course lecture", 500)
    );
  }
};

// delete lecture of any course
const deleteLectureToCourseById = async (req, res, next) => {
  try {
    // const { id, lectureId } = req.params;
    const { courseId, lectureId } = req.query;
    console.log(courseId, lectureId);

    // const lectureId = req.body.lectureId;

    if (!courseId) {
      return next(new AppError("Course id requierd", 400));
    }

    if (!lectureId) {
      return next(new AppError("Lectures id requierd", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError("Course does't exist with given id", 400));
    }

    const removedCourse = course.lectures.filter((lec) => lec._id == lectureId);

    if (!removedCourse.length) {
      return next(new AppError("Lecture id of given course is wrong", 400));
    }

    course.lectures = course.lectures.filter((lec) => lec._id != lectureId);
    course.numberOfLectures -= 1;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
      course,
    });
  } catch (e) {
    return next(
      new AppError(e.message || "Error on creating course lecture", 500)
    );
  }
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById,
  deleteLectureToCourseById,
};
