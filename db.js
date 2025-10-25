import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}`);
    console.log(`MongoDB connected to DB: ${conn.connection.name}`);
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};
export default connectDB;
