import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPolicyAcknowledgement extends Document {
  userId: mongoose.Types.ObjectId;
  policyId: mongoose.Types.ObjectId;
  acknowledgedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PolicyAcknowledgementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    policyId: { type: Schema.Types.ObjectId, ref: "Policy", required: true },
    acknowledgedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Unique compound index for user + policy version checks
PolicyAcknowledgementSchema.index({ userId: 1, policyId: 1 }, { unique: true });

const PolicyAcknowledgement: Model<IPolicyAcknowledgement> =
  mongoose.models.PolicyAcknowledgement ||
  mongoose.model<IPolicyAcknowledgement>("PolicyAcknowledgement", PolicyAcknowledgementSchema);
export default PolicyAcknowledgement;
