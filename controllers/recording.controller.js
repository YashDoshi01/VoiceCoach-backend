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

export const GetDashboardController = async (req, res) => {
    const userId = req.user.id;
  
    try {
      console.log("userId", userId);
  
      // Fetch recordings for this user
      const recordings = await Recording.find({ userId }, { results: 1 });
  
      if (!recordings.length) {
        return res.status(200).json({
          success: true,
          message: "No recordings found",
          data: {
            averages: null,
            totalRecordings: 0,
            feedbacks: [],
            overall_feedback: null,
          },
        });
      }
  
      const fieldsToAverage = [
        "clarity_score",
        "overall_wpm",
        "filler_count",
        "strategic_pauses",
        "hesitation_gaps",
        "relevance_score",
      ];
  
      const averages = {};
      const acousticAverages = {};
  
      // Calculate numeric averages safely
      for (const field of fieldsToAverage) {
        const values = recordings
          .map(r => r.results?.[field])
          .filter(v => v !== undefined && v !== null && !isNaN(v));
  
        averages[field] =
          values.length > 0
            ? parseFloat(
                (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
              )
            : 0; // Default to 0 (avoid sending null to AI API)
      }
  
      // Acoustic metric
      const pitchValues = recordings
        .map(r => r.results?.acoustic_metrics?.pitch_monotony_score)
        .filter(v => v !== undefined && v !== null && !isNaN(v));
  
      acousticAverages.pitch_monotony_score =
        pitchValues.length > 0
          ? parseFloat(
              (pitchValues.reduce((a, b) => a + b, 0) / pitchValues.length).toFixed(2)
            )
          : 0;
  
      // Aggregate words, phrases, and feedbacks
      const allFillerWords = new Set();
      const allVaguePhrases = new Set();
      const allFeedbackMessages = [];
  
      recordings.forEach(r => {
        const res = r.results;
        if (!res) return;
  
        if (Array.isArray(res.filler_words_used))
          res.filler_words_used.forEach(w => allFillerWords.add(w));
  
        if (Array.isArray(res.vague_phrases_found))
          res.vague_phrases_found.forEach(p => allVaguePhrases.add(p));
  
        if (Array.isArray(res.feedback))
          allFeedbackMessages.push(...res.feedback);
      });
  
      // Prepare feedbacks payload for AI API
      const feedbacks = [
        {
          clarity_score: averages.clarity_score || 0,
          overall_wpm: averages.overall_wpm || 0,
          filler_count: averages.filler_count || 0,
          filler_words_used: Array.from(allFillerWords),
          feedback: allFeedbackMessages.length ? allFeedbackMessages : ["No feedback available."],
          vague_phrases_found: Array.from(allVaguePhrases),
        },
      ];
  
      // ✅ Make API call to AI endpoint
    //   const aiResponse = await axios.post(
    //     "https://ai-presentation-coach.onrender.com/overall_feedback",
    //     { feedbacks },
    //     { headers: { "Content-Type": "application/json" } }
    //   );
  
      // Build final response
      const result = {
        averages: { ...averages, acoustic_metrics: acousticAverages },
        totalRecordings: recordings.length,
        feedbacks,
        // overall_feedback: aiResponse.data, // AI's summarized feedback
      };
  
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in GetDashboardController:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        details: error.response?.data || null,
      });
    }
  };