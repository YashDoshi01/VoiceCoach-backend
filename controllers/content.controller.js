import Content from "../models/content.model.js";

export const CreateContentController =  async (req , res) => {
    try {
        const { topic , timelimit  } = req.body;
        if(!topic || !timelimit){
            return res.status(400).json({ message : "All fields are required"});
        }
        const newContent = new Content({
            topic,
            timelimit,
        });
        await newContent.save();
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
        return res.status(500).json({ message : "Internal Server Error"});
    }


};