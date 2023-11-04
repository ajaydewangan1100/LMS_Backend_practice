import AppError from "../utils/error.util";
import User from "../models/user.model";

// defining cookieOption for use when we store cookie
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

// User register
const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    // next is used it will let the error into a middleware which is defined under app.js, and that middleware can handle all error which we are sending as res to user
    return next(new AppError("All fields are required", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("Email already exists", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "link of avatar image given by cloudinary",
    },
  });

  if (!user) {
    return next(
      new AppError("User registration failed, please try again", 500)
    );
  }

  // TODO: file upload - avatar image

  await user.save();

  // before sending user info back to frontend, remove password
  user.password = undefined;

  // generating jwt token
  const token = await user.generateJWTToken();

  // storing token on users browser
  res.cookie("token", token, cookieOption);

  res.status(201).json({
    successs: true,
    message: "User registered successfully",
    user,
  });
};

// User Login
const login = (req, res) => {};

// User Logout
const logout = (req, res) => {};

// User profile getting
const getProfile = (req, res) => {};

//
// Export all user controllers
export { register, login, logout, getProfile };
