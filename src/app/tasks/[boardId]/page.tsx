"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { IoIosAdd } from "react-icons/io";
import { toast } from "sonner";
import { Task } from "~/app/types/types";
import Column from "~/components/coloumn";
import Modal from "~/components/modals/modal";
import { useGetQuery } from "~/app/providers/query/getQuery";
import { convert_to_value } from "~/app/server/utils/helpers";

const KanbanBoard = ({ params }: { params: { boardId: string } }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [modalTask, setModalTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [params.boardId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/task`, {
        params: { boardId: params.boardId },
      });
      setTasks(response.data?.data?.document || []);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching tasks");
    }
  };

  const { data, isLoading } = useGetQuery({ url: `/board/${params.boardId}` });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If there's no destination or the item is dropped in the same position, do nothing
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Find the dragged task
    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) return;

    // Convert the destination droppableId to the status title
    const updatedStatus = convert_to_value(destination.droppableId);

    // Optimistically update the UI
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: updatedStatus } : task,
    );
    setTasks(updatedTasks);

    try {
      // Update the task status on the server
      await axios.put(`/api/task`, {
        taskId: draggableId,
        status: updatedStatus,
      });
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status");

      // Revert the UI state if the API call fails
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === draggableId ? { ...task, status: task.status } : task,
        ),
      );
    }
  };

  const openModal = (task: Task | null = null) => {
    setModalTask(task);
    setIsCreate(true);
  };

  const closeModal = () => {
    setModalTask(null);
    setIsCreate(false);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/api/task`, {
        data: { taskId },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => openModal()}
        >
          <IoIosAdd className="mr-2" /> Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {data?.data?.document?.map((item) => (
              <Droppable
                key={item._id}
                droppableId={convert_to_value(item.title)}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-[25rem] min-h-screen flex-shrink-0 rounded border border-gray-300 bg-gray-100 p-4"
                  >
                    <Column
                      title={item.title}
                      tasks={tasks.filter(
                        (task) => task.status === convert_to_value(item.title),
                      )}
                      onEdit={openModal}
                      onDelete={handleDelete}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      {isCreate && (
        <Modal
          closeModal={closeModal}
          title={modalTask ? "Edit Task" : "Create Task"}
          task={modalTask}
          boardId={params.boardId}
          refreshTasks={fetchTasks}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
