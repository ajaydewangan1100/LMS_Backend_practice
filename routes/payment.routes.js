import { Router } from "express";
import {
  allPayments,
  buySubscrition,
  cancelSubscrition,
  getRazorpayApiKey,
  verifySubscrition,
} from "../controllers/payment.controller.js";
import { authorizedRoles, isLoggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/razorpay-key").get(isLoggedin, getRazorpayApiKey);

router.route("/subscribe").post(isLoggedin, buySubscrition);

router.route("/verify").post(isLoggedin, verifySubscrition);

router.route("/unsubscribe").post(isLoggedin, cancelSubscrition);

router.route("/").get(isLoggedin, authorizedRoles("ADMIN"), allPayments);

export default router;
