import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChallengeParticipation extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  status: "Pending" | "Completed" | "Failed";
  proofUrl?: string; // local file upload or remote URL
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeParticipationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

const ChallengeParticipation: Model<IChallengeParticipation> =
  mongoose.models.ChallengeParticipation ||
  mongoose.model<IChallengeParticipation>("ChallengeParticipation", ChallengeParticipationSchema);
export default ChallengeParticipation;
