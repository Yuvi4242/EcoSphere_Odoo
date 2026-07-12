import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  parentDepartment?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    parentDepartment: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

const Department: Model<IDepartment> =
  mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema);
export default Department;
