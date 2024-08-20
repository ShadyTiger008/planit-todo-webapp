import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { client_api } from "~/app/config";
import { Clock, Info, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  task: any;
};

const DetailsModal = ({ task }: Props) => {
  const handleEdit = () => {
    // onEdit();
    toast.info("Edit action triggered"); // Provide feedback to the user
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      // onDelete();
      toast.success("Task deleted successfully");
    }
  };

  return (
    <div className="flex flex-col space-y-4 rounded-lg border bg-white p-6 shadow-md">
      {/* Task Image */}
      {task.image && (
        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={`${client_api}/${task.image}`}
            alt={task.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      {/* Task Title and Tags */}
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {task.tags?.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Task Description */}
      <p className="text-base text-gray-600">{task.description}</p>

      {/* Task Priority */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold text-gray-700">Priority:</span>
        <span
          className={`text-sm font-medium text-gray-600 ${
            task.priority.toLowerCase() === "high"
              ? "text-red-500"
              : task.priority.toLowerCase() === "medium"
                ? "text-yellow-500"
                : "text-green-500"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Task Dates */}
      <div className="flex flex-col space-y-1 text-sm text-gray-500">
        <div className="flex justify-between">
          <span className="font-medium">Created:</span>
          <span>{new Date(task.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Last Updated:</span>
          <span>{new Date(task.updatedAt).toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-red-500">
          <Clock className="h-4 w-4" />
          <span>{new Date(task.dueDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Edit and Delete Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default DetailsModal;
