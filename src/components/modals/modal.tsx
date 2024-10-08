import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { IoIosClose } from "react-icons/io";
import { Task } from "~/app/types/types";

interface ModalProps {
  closeModal: () => void;
  title: string;
  task: Task | null;
  boardId: string;
  refreshTasks: () => void;
  statuses: { [key: string]: string }; // Add a dictionary for statuses
}

const Modal: React.FC<ModalProps> = ({
  closeModal,
  title,
  task,
  boardId,
  refreshTasks,
  statuses,
}) => {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const statusTitle = statuses[status] || status; // Convert status to title

      if (task) {
        // Edit task
        await axios.put(`/api/updateTask`, {
          taskId: task._id,
          name,
          description,
          status: statusTitle, // Send status title
        });
        toast.success("Task updated successfully");
      } else {
        // Create new task
        await axios.post(`/api/task`, {
          boardId,
          name,
          description,
          status: statusTitle, // Send status title
        });
        toast.success("Task created successfully");
      }
      refreshTasks();
      closeModal();
    } catch (error) {
      toast.error("Error saving task");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={closeModal}>
            <IoIosClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Task Name</label>
            <input
              type="text"
              className="w-full rounded border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              className="w-full rounded border p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className="w-full rounded border p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.entries(statuses).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
