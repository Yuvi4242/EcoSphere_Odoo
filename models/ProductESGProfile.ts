import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductESGProfile extends Document {
  name: string;
  description?: string;
  carbonFootprint: number; // in kg CO2e
  socialRating: number; // score 1-100
  governanceRating: number; // score 1-100
  createdAt: Date;
  updatedAt: Date;
}

const ProductESGProfileSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    carbonFootprint: { type: Number, required: true, default: 0 },
    socialRating: { type: Number, required: true, min: 0, max: 100, default: 100 },
    governanceRating: { type: Number, required: true, min: 0, max: 100, default: 100 },
  },
  { timestamps: true }
);

const ProductESGProfile: Model<IProductESGProfile> =
  mongoose.models.ProductESGProfile || mongoose.model<IProductESGProfile>("ProductESGProfile", ProductESGProfileSchema);
export default ProductESGProfile;
