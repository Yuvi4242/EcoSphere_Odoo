import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description: string;
  xpReward: number;
  badgeReward?: string;
  type: "carbon" | "social" | "governance";
  deadline: Date;
  completedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    xpReward: { type: Number, required: true },
    badgeReward: { type: String }, // optional badge image name or code
    type: {
      type: String,
      enum: ["carbon", "social", "governance"],
      required: true,
    },
    deadline: { type: Date, required: true },
    completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Challenge: Model<IChallenge> =
  mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", ChallengeSchema);
export default Challenge;
