import mongoose, { Document, Model, Schema } from "mongoose";

// Interface definition for Status
export interface IStatus extends Document {
  title: string;
  boardId: mongoose.Types.ObjectId;
  color: string;
  order: number; // Add order field
}

// Schema definition for Status
const statusSchema = new Schema<IStatus>(
  {
    title: {
      type: String,
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    color: {
      type: String,
      default: "blue", // Default color for new tasks
    },
    order: {
      type: Number,
      required: true, // Ensure order is set
    },
  },
  { timestamps: true },
);

// Create and export the Status model
const Status: Model<IStatus> =
  mongoose.models.Status || mongoose.model<IStatus>("Status", statusSchema);

export default Status;
