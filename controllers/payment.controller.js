import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";

export const getRazorpayApiKey = async (req, res, next) => {
  // first we need to return razorpay key to client
  req.status(200).josn({
    success: true,
    message: "Razorpay API Key",
    key: process.env.RAZORPAY_KEY_ID,
  });
};

export const buySubscription = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("Unauthorized, please login", 400));
  }

  if (user.role === "ADMIN") {
    return next(new AppError("Admin cannot purchase a subscription", 400));
  }

  const subscription = await razorpay.subscription.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customar_notify: 1,
  });

  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;

  await user.save()

  res.status(200).json({
    success: true,
    message: "Subscribed successfully",
    subscription_id: subscription.id
  })
};

export const verifySubscrition = async (req, res, next) => {};

export const cancelSubscrition = async (req, res, next) => {};

export const allPayments = async (req, res, next) => {};
