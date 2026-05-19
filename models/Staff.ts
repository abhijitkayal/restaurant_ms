import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStaff extends Document {
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Inactive";
  shift: "Morning" | "Afternoon" | "Evening" | "Night";
  hourlyRate: number;
  hoursWorked: number;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ["Chef", "Sous Chef", "Waiter", "Waitress", "Bartender", "Host", "Cashier", "Manager", "Kitchen Staff", "Cleaner"] },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ["Active", "On Leave", "Inactive"], default: "Active" },
    shift: { type: String, enum: ["Morning", "Afternoon", "Evening", "Night"], required: true },
    hourlyRate: { type: Number, required: true, min: 0 },
    hoursWorked: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Staff: Model<IStaff> =
  mongoose.models.Staff || mongoose.model<IStaff>("Staff", StaffSchema);

export default Staff;
