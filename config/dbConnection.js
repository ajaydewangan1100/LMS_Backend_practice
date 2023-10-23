import mongoose from "mongoose";

// this setting of mongoose will tell mongoose to not use strictquery - means if any information asked by route and it is not exist under DB then it doesn't give error
// mongoose.set("strictQuery", false);

const connectionToDB = async () => {
  console.log("first");
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI || "mongod://127.0.0.1:27017/lms"
    );

    if (connection) {
      console.log("Connected to DB: ${connection.host}");
    }
  } catch (err) {
    console.log(err);
    // when error stop all execution and exit
    process.exit(1);
  }
  // we can add retry for connection of database if fail in any condition - but DB connection always works
};

export default connectionToDB;
