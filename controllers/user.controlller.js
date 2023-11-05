import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking required fields
    if (!email || !password) {
      return next(new AppError("All fields are reqired", 400));
    }

    // find user under DB
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Account not exist", 400));
    }

    // compare password
    if (!user.comparePassword(password)) {
      return next(new AppError("Wrong password", 400));
    }

    // geenrate cookie
    const token = await user.generateJWTToken();

    // set cookie
    res.cookie("token", token, cookieOption);

    // flush password
    user.password = undefined;

    // send res to user
    res.status(200).json({
      success: true,
      message: "User loggedin successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

// User Logout
const  logout = (req, res) => {
  try {
    res.cookie("token", null, {
      secre: true,
      maxAge: 0,
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (e) {
    return next(new AppError("Failed to logout, try again", 400));
  }
};

// User profile getting
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // find user under DB          
    const user = await User.findOne({ userId });

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (e) {
    return next(new AppError("Failed to fetch user details", 500));
  }
};

//
// Export all user controllers
export { register, login, logout, getProfile };
