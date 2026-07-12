import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBadge extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  triggerType: "XP" | "ChallengesCompleted" | "CSRParticipation";
  triggerValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    triggerType: { type: String, enum: ["XP", "ChallengesCompleted", "CSRParticipation"], required: true },
    triggerValue: { type: Number, required: true },
  },
  { timestamps: true }
);

const Badge: Model<IBadge> =
  mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema);
export default Badge;
