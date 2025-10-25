import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
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
});
const Content = mongoose.model("Content", contentSchema);
export default Content;