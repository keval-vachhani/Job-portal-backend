const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connectURL = process.env.DB_URL;
    await mongoose.connect(connectURL);
    console.log("database connected successfully");
  } catch (error) {
    console.log({
      error: error,
      message: "db connection err",
    });
  }
};
module.exports = { connectDb };
