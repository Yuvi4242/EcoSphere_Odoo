import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICarbonRecord extends Document {
  userId: mongoose.Types.ObjectId;
  scope: 1 | 2 | 3;
  category: string;
  value: number;
  co2e: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CarbonRecordSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scope: { type: Number, enum: [1, 2, 3], required: true },
    category: { type: String, required: true }, // "electricity", "fuel", "travel", "waste"
    value: { type: Number, required: true },
    co2e: { type: Number, required: true }, // Calculated kg CO2 equivalent
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

const CarbonRecord: Model<ICarbonRecord> =
  mongoose.models.CarbonRecord || mongoose.model<ICarbonRecord>("CarbonRecord", CarbonRecordSchema);
export default CarbonRecord;
