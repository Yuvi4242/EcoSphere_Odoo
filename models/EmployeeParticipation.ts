import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmployeeParticipation extends Document {
  userId: mongoose.Types.ObjectId;
  activityId: mongoose.Types.ObjectId;
  hoursVolunteered: number;
  status: "Pending" | "Approved" | "Rejected";
  proofUrl?: string; // local file upload or remote URL
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeParticipationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activityId: { type: Schema.Types.ObjectId, ref: "CSRActivity", required: true },
    hoursVolunteered: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    proofUrl: { type: String },
  },
  { timestamps: true }
);

const EmployeeParticipation: Model<IEmployeeParticipation> =
  mongoose.models.EmployeeParticipation ||
  mongoose.model<IEmployeeParticipation>("EmployeeParticipation", EmployeeParticipationSchema);
export default EmployeeParticipation;
