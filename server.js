import app from "./app.js";

// for using environment variable
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
