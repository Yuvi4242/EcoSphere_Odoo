import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport extends Document {
  title: string;
  type: "ESG" | "Carbon" | "CSR" | "Governance" | "Custom";
  filters: Record<string, any>;
  generatedBy: mongoose.Types.ObjectId;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["ESG", "Carbon", "CSR", "Governance", "Custom"],
      required: true,
    },
    filters: { type: Schema.Types.Mixed, default: {} }, // Key-value filters used to compile the report
    generatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String }, // path to download the PDF/Excel
  },
  { timestamps: true }
);

const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
export default Report;
