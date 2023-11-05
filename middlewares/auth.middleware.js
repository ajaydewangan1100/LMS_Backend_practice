import AppError from "../utils/error.util.js";
import JWT from "jsonwebtoken";
const isLoggedin = async (req, res, next) => {
  // get token from users browser
  const { token } = res.cookies;

  //   check token is there or not
  if (!token) {
    return next(new AppError("Unauthenticated! Please login again", 401));
  }

  const userDetails = await JWT.verify(token, process.env.JWT_SECRET);

  //   if userdetails come - set it nder req
  req.user = userDetails;

  //   call next
  next();
};

export { isLoggedin };
