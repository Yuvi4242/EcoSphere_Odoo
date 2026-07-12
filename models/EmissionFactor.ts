import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmissionFactor extends Document {
  activityName: string;
  factor: number; // kg CO2e per unit
  unit: string;
  category: mongoose.Types.ObjectId; // referencing Category
  createdAt: Date;
  updatedAt: Date;
}

const EmissionFactorSchema = new Schema(
  {
    activityName: { type: String, required: true, unique: true },
    factor: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

const EmissionFactor: Model<IEmissionFactor> =
  mongoose.models.EmissionFactor || mongoose.model<IEmissionFactor>("EmissionFactor", EmissionFactorSchema);
export default EmissionFactor;
