import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReward extends Document {
  name: string;
  description: string;
  costXP: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    costXP: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

const Reward: Model<IReward> =
  mongoose.models.Reward || mongoose.model<IReward>("Reward", RewardSchema);
export default Reward;
