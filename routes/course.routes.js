import { Router } from "express";
import {
  getAllCourses,
  getLecturesByCourseId,
} from "../controllers/course.controller.js";
import { isLoggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllCourses);
router.route("/:id").get(isLoggedin, getLecturesByCourseId);

export default router;
