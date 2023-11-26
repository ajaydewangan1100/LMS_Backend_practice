import AppError from "../utils/error.util.js";
import JWT from "jsonwebtoken";

const isLoggedin = async (req, res, next) => {
  // get token from users browser
  const { token } = req.cookies;

  //   check token is there or not
  if (!token) {
    return next(new AppError("Unauthenticated! Please login again", 401));
  }

  const userDetails = await JWT.verify(token, process.env.JWT_SECRET);

  //   if userdetails come - set it under req
  req.user = userDetails;

  //   call next
  next();
};

const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRole = req.user.role;

    if (!roles.includes(currentUserRole)) {
      return next(
        new AppError("You are not authorized to access this route", 403)
      );
    }

    next();
  };

const authorizeSubscriber = async (req, res, next) => {
  const subscription = req.user.subscription;
  const currentUserRole = req.user.role;

  if (currentUserRole !== "ADMIN" || subscription !== "active") {
    return next(new AppError("Please subscribe to access this route", 403));
  }

  next();
};

export { isLoggedin, authorizedRoles, authorizeSubscriber };
