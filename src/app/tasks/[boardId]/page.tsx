"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import { Task } from "~/app/types/types";
import Column from "~/components/coloumn";
import { useGetQuery } from "~/app/providers/query/getQuery";
import { convert_to_value } from "~/app/server/utils/helpers";
import AddColumnButton from "~/components/add-column-button";
import { NavMenu } from "~/components/navmenu";

const KanbanBoard = ({ params }: { params: { boardId: string } }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch columns using the useGetQuery hook
  const {
    data: columnsData,
    isLoading: columnsLoading,
    refetch,
  } = useGetQuery({
    url: `/board/${params.boardId}`,
  });

  useEffect(() => {
    fetchTasks();
  }, [params.boardId]);

  useEffect(() => {
    if (columnsData) {
      const sortedColumns = (columnsData?.data?.document || []).sort(
        (a: any, b: any) => a.order - b.order,
      );
      setColumns(sortedColumns);
      setLoading(false);
    }
  }, [columnsData]);

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

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    // Handling column drag-and-drop
    if (type === "COLUMN") {
      const reorderedColumns = Array.from(columns);
      const [removed] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removed);

      setColumns(reorderedColumns);

      try {
        await axios.put("/api/columns", {
          columns: reorderedColumns.map((column, index) => ({
            _id: column._id,
            order: index,
          })),
        });
        toast.success("Column order updated successfully");
      } catch (error) {
        console.error("Error updating column order:", error);
        toast.error("Error updating column order");
      }

      return;
    }

    // Handling task drag-and-drop
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const draggedTask = tasks.find((task) => task._id === draggableId);
    if (!draggedTask) return;

    const updatedStatus = convert_to_value(destination.droppableId);

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: updatedStatus } : task,
    );
    setTasks(updatedTasks);

    try {
      await axios.put("/api/task", {
        taskId: draggableId,
        status: updatedStatus,
      });
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status");

      // Revert task status on failure
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === draggableId ? { ...task, status: task.status } : task,
        ),
      );
    }
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

  if (loading || columnsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-h-screen overflow-y-hidden p-4">
      <div className="mb-4 flex items-center justify-between">
        <NavMenu />
        <h1 className="text-2xl font-bold hidden md:block">Kanban Board</h1>
        <AddColumnButton boardId={params.boardId} refetch={refetch} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <div
              className="flex space-x-4 overflow-x-scroll"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p- min-h-screen w-[20rem] flex-shrink-0 overflow-y-hidden rounded border border-gray-300 bg-gray-100 md:w-[25rem]"
                    >
                      <Droppable droppableId={convert_to_value(item.title)}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="max-h-screen w-full"
                          >
                            <Column
                              title={item.title}
                              tasks={tasks.filter(
                                (task) =>
                                  task.status === convert_to_value(item.title),
                              )}
                              droppableId={convert_to_value(item.droppableId)}
                              refetch={refetch}
                              boardId={params.boardId}
                              statusId={item._id}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
