import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComplianceIssue extends Document {
  title: string;
  description: string;
  status: "Open" | "Resolved" | "Overdue";
  dueDate: Date;
  owner: mongoose.Types.ObjectId; // referencing User
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceIssueSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Open", "Resolved", "Overdue"], default: "Open" },
    dueDate: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ComplianceIssue: Model<IComplianceIssue> =
  mongoose.models.ComplianceIssue || mongoose.model<IComplianceIssue>("ComplianceIssue", ComplianceIssueSchema);
export default ComplianceIssue;
