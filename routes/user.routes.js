import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/user.controlller.js";
import { isLoggedin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register); // middleware used for process media file
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedin, getProfile);

export default router;
