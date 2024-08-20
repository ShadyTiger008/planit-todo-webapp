import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "~/app/types/types";
import Image from "next/image";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import { client_api } from "~/app/config";

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
                      className="cursor-pointer rounded-lg bg-white p-4 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                    >
                      <div className="relative flex flex-col space-y-2 rounded-lg bg-white p-4 shadow-lg">
                        {task.image && (
                          <div className="relative mb-4 h-40 w-full">
                            <Image
                              src={`${client_api}/${task.image}`}
                              alt={task.title}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-t-lg"
                            />
                          </div>
                        )}
                        <h3 className="mb-2 text-lg font-bold">{task.title}</h3>
                        <p className="mb-2 truncate text-sm text-gray-600">
                          {task.description}
                        </p>
                        <p className="mb-2 text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p className="mb-2 text-sm font-bold text-red-500">
                          Priority: {task.priority}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {task.tags?.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="rounded-md border border-gray-300 p-1 text-xs font-semibold text-gray-500"
                            >
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
