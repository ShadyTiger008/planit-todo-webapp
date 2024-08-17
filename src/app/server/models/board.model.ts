import mongoose, { Document, Schema } from "mongoose";

// export interface IKanbanBoard extends Document {
//   name: string;
//   description: string; // Add description to the interface
//   userId: string;
//   createdAt: Date;
//   tasks: mongoose.Types.ObjectId[];
// }

const kanbanBoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true },
);

const KanbanBoard =
  mongoose.models.KanbanBoard ||
  mongoose.model<any>("KanbanBoard", kanbanBoardSchema);

export default KanbanBoard;
