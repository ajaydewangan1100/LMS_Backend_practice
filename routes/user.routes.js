import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controlller.js";
import { isLoggedin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register); // middleware used for process media file
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedin, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
