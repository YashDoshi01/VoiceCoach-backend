import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    userId : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    
    topic : {
        type : String,
        required : true
    },
    timelimit : {
        type : Number,
        required : true
    },
    content : {
        type : String,
        default : ''
    },
    wordcount : {
        type : Number,
        default : 0
    },
    title : {
        type : String,
        default : ''
    },
    tone : {
        type : String,
        default : '' 
    },
}, { timestamps : true
});
const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);
export default Content;