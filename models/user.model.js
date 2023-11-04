import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: "String",
      required: [true, "Name is required"],
      minLength: [4, "Name must be atleast 4 character"],
      maxLength: [50, "Name should be less then 50 character"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: "String",
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill valid email address",
      ],
    },
    password: {
      type: "String",
      required: [true, "PAssword is required"],
      minLength: [8, "Password length must be at least 8 character"],
      select: false,
    },
    avatar: {
      public_id: {
        type: "String",
      },
      secure_url: {
        type: "String",
      },
    },
    role: {
      type: "String",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // bcrypt needs to await
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJWTToken : async function() {
    return await jwt.sign(
      {id: this._id, email: this.email, subscription: this.subscription, role: this.role},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRY}
    )
  }
}

const User = model("User", userSchema);

export default User;
