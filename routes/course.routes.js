import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { isLoggedin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllCourses)
  .post(isLoggedin, upload.single("thumbnail"), createCourse);

router
  .route("/:id")
  .get(isLoggedin, getLecturesByCourseId)
  .put(isLoggedin, updateCourse)
  .delete(isLoggedin, removeCourse);

export default router;
