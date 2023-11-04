import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
// user route import
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// for parse and read json
app.use(express.json());

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

// routes for 3 modules - user, course, payment related
// User routes -
app.use("/api/v1/user", userRoutes);


// unknown route handling - which is not handled by upper route options
app.all("*", (req, res) => {
  res.status(400).send("OOPS!! 404 page not found!");
});

// middleware which is defined here, and that middleware can handle all error which we want to send as res to user
app.use(errorMiddleware);

export default app;
