import mongoose, { Document, Model, Schema } from "mongoose";

// enum Status {
//   TODO = "TODO",
//   IN_PROGRESS = "IN_PROGRESS",
//   DONE = "DONE",
// }

enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  boardId: mongoose.Types.ObjectId;
  status: string;
  image: string;
  tags: string[];
  priority: Priority;
}

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
      default: null,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.LOW,
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  { timestamps: true },
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
