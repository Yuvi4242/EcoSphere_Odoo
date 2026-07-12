import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAudit extends Document {
  title: string;
  auditor: string;
  date: Date;
  findings?: string;
  scope: "Environmental" | "Social" | "Governance";
  createdAt: Date;
  updatedAt: Date;
}

const AuditSchema = new Schema(
  {
    title: { type: String, required: true },
    auditor: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    findings: { type: String },
    scope: { type: String, enum: ["Environmental", "Social", "Governance"], required: true },
  },
  { timestamps: true }
);

const Audit: Model<IAudit> =
  mongoose.models.Audit || mongoose.model<IAudit>("Audit", AuditSchema);
export default Audit;
