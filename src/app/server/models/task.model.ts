import mongoose, { Document, Model, Schema } from "mongoose";

// Define the Status enum
enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

// Extend the ITask interface to include the status enum
export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  boardId: mongoose.Types.ObjectId;
  status: Status;
}

// Define the taskSchema using the Mongoose schema
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(Status), // Use the enum values as allowed options
      default: Status.TODO, // Set a default value if needed
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  { timestamps: true },
);

// Create and export the Task model
const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
