import Presentation from "../models/presentation.model.js";
import axios from "axios";
import FormData from "form-data";

export const CreatePresentationController = async (req, res) => {
  const formdata = new FormData();

  try {
    const userId = req.user.id;
    const { topic, timelimit } = req.body;

    if (!topic || !timelimit) {
      return res.status(400).json({ message: "All fields are required" });
    }

    formdata.append("topic", topic);
    formdata.append("time_limit_minutes", timelimit);

    // Call external AI API
    const response = await axios.post(
      "https://ai-presentation-coach.onrender.com/presentation_content",
      formdata,
      {
        headers: {
          ...formdata.getHeaders(),
        },
      }
    );

    console.log("Response from presentation gen:", response.data);
    const result = response.data;

    // Create a new presentation document
    const newPresentation = await Presentation.create({
      userId,
      template_suggestion: result.template_suggestion,
      topic: result.topic,
      time_limit_minutes: result.time_limit_minutes,
      slides: result.slides, // Directly save slides array
    });

    return res.status(201).json({
      success: true,
      message: "Presentation created successfully",
      presentation: newPresentation,
    });
  } catch (err) {
    console.error("Error in CreatePresentationController:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getAllPresentations = async (req, res) => {
  try {
    const userId  = req.user.id;
    const presentations = await Presentation.find({userId}, '-__v').sort({ createdAt: -1 }); 
    res.status(200).json({ success: true, data: presentations });
  } catch (error) {
    console.error("Error fetching presentations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
