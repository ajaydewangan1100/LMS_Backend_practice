import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// defining cookieOption for use when we store cookie
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  // httpOnly: true,
  // secure: true,
};

// User register
const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  // console.log(req.body);
  // console.log(fullName, email, password);

  if (!fullName || !email || !password) {
    // next is used it will let the error into a middleware which is defined under app.js, and that middleware can handle all error which we are sending as res to user
    return next(new AppError("All fields are required!", 400));
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

  // TODO: file upload - avatar image --> Done here ---------------------------------------->

  if (req.file) {
    // console.log("file ---> ", req.file);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // remove file from server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (e) {
      // remove file from server
      fs.rm(`uploads/${req.file.filename}`);
      return next(new AppError(e || "Error on avatar file upload", 500));
    }
  }

  await user.save();

  // before sending user info back to frontend, remove password
  user.password = undefined;

  // generating jwt token
  const token = await user.generateJWTToken();

  // storing token on users browser
  res.cookie("token", token, cookieOption);

  res.status(200).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};

// User Login
const login = async (req, res, next) => {
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
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new AppError("Wrong password!!!", 400));
  }

  // geenrate cookie
  const token = await user.generateJWTToken();

  // flush password
  user.password = undefined;

  // set cookie
  res.cookie("token", token, cookieOption);

  // send res to user
  res.status(200).json({
    success: true,
    message: "User loggedin successfully",
    user,
  });
  // try {
  // } catch (e) {
  //   return next(new AppError(e.message, 500));
  // }
};

// User Logout
const logout = (_req, res, next) => {
  try {
    console.log("under back");
    res.cookie("token", null, {
      secure: true,
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
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // find user under DB
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User invalid, login again", 400));
    }

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (e) {
    return next(new AppError("Failed to fetch user details", 500));
  }
};

// forgot Password controller
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Email not registered", 400));
  }

  const resetToken = await user.generatePasswordResetToken(); // function defined under user model

  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank"> Reset your password</a> \n If the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}. \n If you have not requested this, kindly ignore.`;

  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (e) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return next(new AppError(e.message || "Internal error, try again", 400));
  }
};

// reset password controller
const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;

  const { password } = req.body;

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

// changing the password if old password already know
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const { id } = req.user;

  if (!oldPassword || !newPassword) {
    return next(new AppError("All fields are mendatory", 400));
  }

  const user = await User.findById(id).select("+password");

  if (!user) {
    return next(new AppError("User doesn't exist", 400));
  }

  const isPasswordValid = user.comparePassword(oldPassword);

  if (!isPasswordValid) {
    return next(new AppError("Invalid old password", 400));
  }

  await user.save();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Password changes successfully",
  });
};

// Update user profile
const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.user.id;

  const user = await User.findOne(id);

  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  if (fullName) {
    user.fullName = fullName;
  }

  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // remove file from server
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (e) {
      // remove file from server
      fs.rm(`uploads/${req.file.filename}`);
      return next(new AppError(e || "Error on avatar file upload", 500));
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
  });
};

//
// Export all user controllers
export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};
