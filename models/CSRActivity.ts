import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICSRActivity extends Document {
  title: string;
  description: string;
  date: Date;
  type: "blood_donation" | "tree_plantation" | "other";
  volunteers: mongoose.Types.ObjectId[];
  impactMetric?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CSRActivitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    type: {
      type: String,
      enum: ["blood_donation", "tree_plantation", "other"],
      required: true,
    },
    volunteers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    impactMetric: { type: String }, // e.g., "50 Liters of blood collected" or "200 trees planted"
  },
  { timestamps: true }
);

const CSRActivity: Model<ICSRActivity> =
  mongoose.models.CSRActivity || mongoose.model<ICSRActivity>("CSRActivity", CSRActivitySchema);
export default CSRActivity;
