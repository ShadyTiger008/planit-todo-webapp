import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "~/app/types/types";

interface ColumnProps {
  title: string;
  tasks: Task[];
  droppableId: string;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, droppableId }) => {
  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[150px] space-y-4"
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="cursor-pointer rounded-lg bg-white p-4 shadow-md"
                  >
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
