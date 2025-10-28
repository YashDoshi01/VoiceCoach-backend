import Voiceover from "../models/voiceover.model.js";
import axios from "axios";
export const CreatevoiceoverController = async (req, res) => {
    try {
        const { topic, timelimit } = req.body;
        const userId = req.user.id;
        if(!topic || !timelimit){
            return res.status(400).json({ message: "All fields are required" });
        }
        const response = await axios.post(
            "https://ai-presentation-coach.onrender.com/generate_ai_voiceover",
            {
                topic,
                time_limit_minutes : timelimit,
            }
        );
        const result = response.data;
        const newVoiceover = await Voiceover.create({
            userId,
            topic,
            time_limit_minutes : timelimit,
            full_voiceover_script : result.full_voiceover_script,
            audio_file_url : result.audio_file_url,
        });
        return res.status(200).json({ message: "Voiceover created successfully", newVoiceover });
    } catch (error) {
        console.error("Error in CreatevoiceoverController: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetvoiceoverController = async (req, res) => {
    try {
        const userId = req.user.id;
        const voiceovers = await Voiceover.find({ userId });
        return res.status(200).json({ message: "Voiceovers fetched successfully", voiceovers });
    } catch (error) {
        console.error("Error in GetvoiceoverController: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}