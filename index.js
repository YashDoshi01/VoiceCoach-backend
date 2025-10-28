import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import authrouter from './routes/auth.route.js';
import recordingRouter from './routes/recording.route.js';
import contentRouter from './routes/content.route.js';
import presentationRouter from './routes/presentation.route.js';
import dashboardRouter from './routes/dashboard.route.js';
dotenv.config();
const app  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authrouter);
app.use("/api/recording", recordingRouter);   
app.use("/api/content", contentRouter);
app.use("/api/presentation" ,presentationRouter );
app.use("/api/dashboard", dashboardRouter);
app.use("/api/voiceover", voiceoverRouter);
app.listen(PORT , ()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})
