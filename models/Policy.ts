import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPolicy extends Document {
  title: string;
  description: string;
  version: string;
  publishedAt: Date;
  acceptedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    acceptedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who accepted this policy
  },
  { timestamps: true }
);

const Policy: Model<IPolicy> =
  mongoose.models.Policy || mongoose.model<IPolicy>("Policy", PolicySchema);
export default Policy;
