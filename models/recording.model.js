import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema({
  transcript: [
    {
      text: { type: String, required: true },
      start: { type: Number, required: true },
      end: { type: Number, required: true },
      tags: [{ type: String }], 
    },
  ],
});


const resultSchema = new mongoose.Schema({
  clarity_score: { type: Number },
  overall_wpm: { type: Number },
  filler_count: { type: Number },
  strategic_pauses: { type: Number },
  hesitation_gaps: { type: Number },
  acoustic_metrics: {
    avg_volume_status: { type: String },
    pitch_monotony_score: { type: Number },
  },
  relevance_score: { type: Number, default: null },
  suggested_content: [{ type: String }],
  vague_phrases_found: [{ type: String }],
  feedback: [{ type: String }],
  filler_words_used: [{ type: String }],
});

const metadataSchema = new mongoose.Schema({
  filename : {type: String},
  duration: { type: Number },
  file_size: { type: Number },
  format: { type: String },
});

const recordingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    results: {
      type: resultSchema,
      default: {}, 
    },
    metadata : {
      type: metadataSchema,
      default: {},
    },
    transcription: {type : transcriptionSchema , default : {}},
  },
  { timestamps: true }
);

const Recording = mongoose.models.Recording || mongoose.model("Recording", recordingSchema);
export default Recording;
