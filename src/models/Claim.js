import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  influencerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Influencer',
    required: true 
  },
  claim: { 
    type: String, 
    required: true 
  },
  extraMessage: String,
  research: {
    researchSummary: String,
    articleLinks: [String],
    trustScore: Number,
    category: String,
    verificationStatus: { 
      type: String, 
      enum: ["Verified", "Questionable", "Debunked"],
      default: "Questionable"
    }
  },
  duplicateHash: { 
    type: String,
    index: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to ensure claims are unique per influencer
claimSchema.index({ influencerId: 1, duplicateHash: 1 }, { unique: true });

export default mongoose.models.Claim || mongoose.model("Claim", claimSchema); 