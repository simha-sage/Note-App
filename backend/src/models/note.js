import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["PRIVATE", "ADMIN_ONLY"],
      default: "PRIVATE",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["personal", "permissions", "reports", "adminOrders"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
