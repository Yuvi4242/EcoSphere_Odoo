import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnvironmentalGoal extends Document {
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: "Active" | "Achieved" | "Failed";
  createdAt: Date;
  updatedAt: Date;
}

const EnvironmentalGoalSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Achieved", "Failed"], default: "Active" },
  },
  { timestamps: true }
);

const EnvironmentalGoal: Model<IEnvironmentalGoal> =
  mongoose.models.EnvironmentalGoal || mongoose.model<IEnvironmentalGoal>("EnvironmentalGoal", EnvironmentalGoalSchema);
export default EnvironmentalGoal;
