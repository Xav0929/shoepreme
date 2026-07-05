import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "staff"], default: "staff" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);