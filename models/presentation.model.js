import mongoose from "mongoose";



const SlideSchema = new mongoose.Schema({
  slide_title: {
    type: String,
    required: true,
  },
  main_points: {
    type: [String],
    required: true,
  },
  visual_suggestion: {
    type: String,
    required: true,
  },
});

const PresentationSchema = new mongoose.Schema({
  userId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  template_suggestion: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  time_limit_minutes: {
    type: Number,
    required: true,
  },
  slides: {
    type: [SlideSchema],
    required: true,
  },
});

const Presentation =  mongoose.model("Presentation", PresentationSchema);
export default Presentation