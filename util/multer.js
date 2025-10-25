// config/multer.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "voicecoach/recordings",  // folder in Cloudinary
    resource_type: "auto",             // auto-detect audio, video, image
 
  },
});

const parser = multer({ storage });

export default parser;
