import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  claim: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  category: String,
  status: { type: String, enum: ["Verified", "Questionable", "Debunked"] },
  trustScore: Number,
  sourceURL: String,
  researchURL: String,
  studyTitle: String,
  aiSummary: String,
  searchQueries: {
    sourceQuery: String,
    researchQuery: String,
  },
});

const influencerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bio: String,
  image: String,
  followers: String,
  yearlyRevenue: String,
  categories: [String],
  claims: [claimSchema],
  trustScore: Number,
  lastUpdated: Date,
  journals: [String],
  assistantNote: String,
});

export default mongoose.models.Influencer ||
  mongoose.model("Influencer", influencerSchema);
