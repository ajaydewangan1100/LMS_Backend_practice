import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";

import { config } from "dotenv";

config();

const app = express();

// for parse and read json
app.use(express.json());
// get query params from url and parsing like things
app.use(express.urlencoded({ extended: true }));

// cors policy defining
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

// cookie-parser
app.use(cookieParser());

// morgan - log info on server related to accessed path - (can use different options - dev,combined,common etc)
app.use(morgan("dev"));

// route for checking - parse the token
app.use("/ping", (req, res) => {
  res.send("pong - 2");
});

// import all routes controllers - user/courses/payment/miscellaneous
import userRoutes from "./routes/user.routes.js";
import coursesRoutes from "./routes/course.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import miscRoutes from "./routes/miscellaneous.routes.js";

// routes for 4 modules - user, course, payment related, miscellaneous
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1", miscRoutes);

// unknown route handling - which is not handled by upper route options
app.all("*", (req, res) => {
  res.status(400).send("OOPS!! 404 page not found!");
});

// middleware which is defined here, and that middleware can handle all error which we want to send as res to user
app.use(errorMiddleware);

export default app;
