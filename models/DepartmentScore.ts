import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartmentScore extends Document {
  departmentId: mongoose.Types.ObjectId; // referencing Department
  environmentalScore: number; // 0-100
  socialScore: number; // 0-100
  governanceScore: number; // 0-100
  overallScore: number; // 0-100
  calculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentScoreSchema = new Schema(
  {
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true, unique: true },
    environmentalScore: { type: Number, required: true, min: 0, max: 100, default: 100 },
    socialScore: { type: Number, required: true, min: 0, max: 100, default: 100 },
    governanceScore: { type: Number, required: true, min: 0, max: 100, default: 100 },
    overallScore: { type: Number, required: true, min: 0, max: 100, default: 100 },
    calculatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const DepartmentScore: Model<IDepartmentScore> =
  mongoose.models.DepartmentScore || mongoose.model<IDepartmentScore>("DepartmentScore", DepartmentScoreSchema);
export default DepartmentScore;
