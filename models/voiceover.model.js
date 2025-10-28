import mongoose from "mongoose";

const RecordingSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    time_limit_minutes: {
      type: Number,
      required: true,
      min: 0,
    },
    estimated_word_count: {
      type: Number,
      required: true,
      min: 0,
    },
    full_voiceover_script: {
      type: String,
      required: true,
    },
    audio_file_url: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("Recording", RecordingSchema);
