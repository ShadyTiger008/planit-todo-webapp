"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { IoIosAdd } from "react-icons/io";
import { toast } from "sonner";
import { Task } from "~/app/types/types";
import Column from "~/components/coloumn";
import Modal from "~/components/modals/modal";

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
      setTasks(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching tasks");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) return;

    const updatedStatus = destination.droppableId;

    // Optimistic UI update
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: updatedStatus } : task,
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`/api/task`, {
        taskId: draggableId,
        status: updatedStatus,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status");

      // Revert the UI state if the API call fails
      setTasks(tasks);
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
        <Droppable droppableId="kanban-board" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Column
                title="Todo"
                tasks={tasks.filter((task) => task.status === "TODO")}
                droppableId="TODO"
                onEdit={openModal}
                onDelete={handleDelete}
              />
              <Column
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
                droppableId="IN_PROGRESS"
                onEdit={openModal}
                onDelete={handleDelete}
              />
              <Column
                title="Completed"
                tasks={tasks.filter((task) => task.status === "DONE")}
                droppableId="DONE"
                onEdit={openModal}
                onDelete={handleDelete}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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
