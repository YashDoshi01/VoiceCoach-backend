import Content from "../models/content.model.js";
import axios from "axios";
import FormData from "form-data";
export const CreateContentController =  async (req , res) => {
    const formdata  = new FormData();
    try {
        const userId = req.user.id;
        const { topic , timelimit , tone } = req.body;
        // const newtime  = parseInt(timelimit);
        if(!topic || !timelimit){
            return res.status(400).json({ message : "All fields are required"});
        }
        formdata.append("topic" , topic);
        formdata.append("time_limit_minutes" , timelimit);
        formdata.append("tone" , tone || "Neutral");
        const response = await axios.post(
  "https://ai-presentation-coach.onrender.com/speech_draft",
  formdata,
  {
    headers: {
      ...formdata.getHeaders(),
    },
  }
);
        console.log("Response from content gen:", response.data);
        const result  = {
            title : response.data.generated_speech_draft[0],
            word_count : response.data.estimated_word_count,
             content : response.data.generated_speech_draft.slice(1).join(" . ")
            }
        const newContent = await Content.create({
            userId,
            topic,
            timelimit,
            content : result.content,
            wordcount : result.word_count,
            title : result.title,
            tone : tone || "Neutral"
        });

        return res.status(201).json({ message : "Content created successfully" , content : newContent});
    }
    catch(err){
        console.error("Error in CreateContentController: ", err);
        return res.status(500).json({ message : "Internal Server Error"});
    }
}
export const GetContentController =  async (req , res) => {
    try {
        const userId = req.user.id;
        const contents = await Content.find({ userId } , '-__v').sort({ createdAt: -1 });
        return  res.status(200).json({ contents });
    }
    catch(err){
        console.error("Error in GetContentController: ", err);
        return res.status(500).json({ message : err});
    }


};