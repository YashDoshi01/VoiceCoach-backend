import Recording from "../models/recording.model.js";


export const CreaterecordingController = async (req, res) => {
  const userId = req.user.id
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;
    const metadata = {
      filename: file.originalname || "unknown",
      duration: file.duration || 0,       
      file_size: file.size || 0,          
      format: file.format || "mp3",       
    };
    const newRecording = new Recording({ userId, filePath , metadata });
    await newRecording.save();
    res.status(201).json({ success: true, message: 'Recording created successfully', recording: newRecording });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const GetrecordingController = async (req, res) => {
    const userId = req.user.id;
    try {
        const recordings = await Recording.find({ userId } , '-__v').sort({ createdAt: -1 });
        res.status(200).json({ success: true, recordings });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }   
};  