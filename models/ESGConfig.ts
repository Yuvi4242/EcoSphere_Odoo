import mongoose, { Schema, Document, Model } from "mongoose";

export interface IESGConfig extends Document {
  environmentalWeight: number;
  socialWeight: number;
  governanceWeight: number;
  autoEmissionCalculation: boolean;
  evidenceRequirement: boolean;
  badgeAutoAward: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ESGConfigSchema = new Schema(
  {
    environmentalWeight: { type: Number, required: true, default: 40, min: 0, max: 100 },
    socialWeight: { type: Number, required: true, default: 30, min: 0, max: 100 },
    governanceWeight: { type: Number, required: true, default: 30, min: 0, max: 100 },
    autoEmissionCalculation: { type: Boolean, required: true, default: true },
    evidenceRequirement: { type: Boolean, required: true, default: true },
    badgeAutoAward: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const ESGConfig: Model<IESGConfig> =
  mongoose.models.ESGConfig || mongoose.model<IESGConfig>("ESGConfig", ESGConfigSchema);
export default ESGConfig;
