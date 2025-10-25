import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import authrouter from './routes/auth.route.js';
dotenv.config();
const app  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authrouter);

app.listen(PORT , ()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})
