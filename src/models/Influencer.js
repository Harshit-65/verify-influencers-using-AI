import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ["Nutrition", "Medicine", "Mental Health", "Fitness"],
  },
  status: { type: String, default: "Pending" },
  trustScore: { type: Number, default: 0 },
  source: String,
  analysis: String,
});

const influencerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  influencerSummary: String,
  followerCount: String,
  image: String,
  claims: [claimSchema],
  trustScore: { type: Number, default: 0 },
  categories: [{ type: String }], // Array of strings for categories
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Influencer ||
  mongoose.model("Influencer", influencerSchema);
