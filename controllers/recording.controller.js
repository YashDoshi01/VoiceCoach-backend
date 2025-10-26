import Recording from "../models/recording.model.js";
import axios  from "axios";
import FormData from "form-data";

export const CreaterecordingController = async (req, res) => {
  const formData = new FormData();
  const userId = req.user.id
  const {topic} = req.body;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;
    formData.append("audio_url", filePath); 
    formData.append("topic", topic);
    const metadata = {
      filename: req.file.originalname || "unknown",
      duration: req.file.duration || 0,       
      file_size: req.file.size || 0,          
      format: req.file.format || "mp3",       
    };
    const response = await axios.post(
  "https://ai-presentation-coach.onrender.com/analyze",
  formData,
  {
    headers: {
      ...formData.getHeaders(),
    },
  }
);
  const responseasdata = response.data;
  console.log("Response from analysis service:", responseasdata);

const results = {
  clarity_score: responseasdata.clarity_score,
  overall_wpm: responseasdata.overall_wpm,
  filler_count: responseasdata.filler_count,
  strategic_pauses: responseasdata.strategic_pauses,
  hesitation_gaps: responseasdata.hesitation_gaps,
  acoustic_metrics: {
    avg_volume_status: responseasdata.acoustic_metrics?.avg_volume_status,
    pitch_monotony_score: responseasdata.acoustic_metrics?.pitch_monotony_score,
  },
  relevance_score: responseasdata.relevance_score ?? null,
  suggested_content: responseasdata.suggested_content || [],
  vague_phrases_found: responseasdata.vague_phrases_found || [],
  feedback: responseasdata.feedback || [],
  filler_words_used: responseasdata.filler_words_used || [],
};

    const newRecording = await Recording.create({
      userId,
      filePath,
      results,
      metadata,
      transcription: {
    transcript: responseasdata.transcript 
  },
    });
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

export const GetrecordingByIdController = async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;  
    try {
        const recording = await Recording.findOne({ _id: id, userId } , '-__v');
        if (!recording) {
            return res.status(404).json({ success: false, message: "Recording not found" });
        }
        res.status(200).json({ success: true, recording });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
