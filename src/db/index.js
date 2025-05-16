import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  } catch (error) {
    console.log("MONGODB connection failed: ", error);
    process.exit(1);
  }
};
