import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "~/app/types/types";
import Image from "next/image";
import { IoMdCreate, IoMdTrash } from "react-icons/io";

interface ColumnProps {
  title: string;
  tasks: Task[];
  droppableId: string;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, droppableId }) => {
  return (
    <div className="shadow- flex flex-col rounded-lg bg-gray-100 p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex min-h-[150px] flex-col space-y-4 overflow-hidden"
          >
            {tasks.map((task: any, index: number) => {
              console.log("Task image: ", task.image);
              
              return (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="cursor-pointer rounded-lg bg-white p-4 shadow-md transition-transform duration-300 ease-in-out"
                    >
                      <div className="relative transform cursor-pointer space-y-2 rounded-lg bg-white p-4 shadow-lg transition-transform hover:scale-105">
                        {task.image && (
                          <Image
                            src="https://unsplash.com/photos/green-trees-near-body-of-water-during-daytime-aCnkRlBD0i4"
                            alt={task.title}
                            fill
                            className="h-40 w-full rounded-t-lg object-cover"
                          />
                        )}
                        <h3 className="text-lg font-bold">{task.title}</h3>
                        <p className="truncate text-sm text-gray-600">
                          {task.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-bold text-red-500">
                          Priority: {task.priority}
                        </p>
                        <div className="flex flex-row items-center justify-start gap-2">
                          {task.tags?.map((tag: string) => (
                            <span className="rounded-md border p-1 text-center text-xs font-semibold text-gray-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
