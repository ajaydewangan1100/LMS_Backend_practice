import app from "./app.js";
// for using environment variable
import { config } from "dotenv";
// connection with DB done by this
import connectionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary";
// razorpay for payment
import Razorpay from "razorpay";

config();

const PORT = process.env.PORT || 5002;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.listen(PORT, async () => {
  // first checking DB connection
  await connectionToDB();
  console.log(`App is running at http://localhost:${PORT}`);
});
