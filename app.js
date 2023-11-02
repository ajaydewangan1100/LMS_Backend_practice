import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

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
//

// unknown route handling - which is not handled by upper route options
app.all("*", (req, res) => {
  res.status(400).send("OOPS!! 404 page not found!");
});

export default app;
