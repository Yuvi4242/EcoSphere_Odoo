import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "Environmental" | "Social" | "Governance";
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Environmental", "Social", "Governance"], required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
