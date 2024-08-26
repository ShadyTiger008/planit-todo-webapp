import React, { useEffect, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "~/app/types/types";
import Image from "next/image";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import { client_api, server_api } from "~/app/config";
import DetailsModal from "./modals/details-modal";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Clock,
  EllipsisVertical,
  Info,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "axios";

interface ColumnProps {
  title: string;
  tasks: Task[];
  droppableId: string;
  boardId: string;
  statusId: string;
  refetch: () => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  droppableId,
  boardId,
  statusId,
  refetch,
}) => {
  const [timers, setTimers] = useState<{ [key: string]: string }>({});

  // Function to calculate time left for each task
  const calculateTimeLeft = (dueDate: Date) => {
    const now = new Date().getTime();
    const difference = new Date(dueDate).getTime() - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
    } else {
      return "Time's up!";
    }
  };

  // useEffect to update the timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers: { [key: string]: string } = {};
      tasks.forEach((task) => {
        updatedTimers[task._id] = calculateTimeLeft(task?.dueDate);
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [tasks]);

  const handleColumnDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `The column will be deleted permanently`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const response = await axios.delete(
          `${server_api}/board/${boardId}?statusId=${statusId}`,
        );
        if (response.data.success) {
          toast.error(response.data.message);
          refetch();
        } else {
          toast.error("Something went wrong!");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="shadow- p- flex flex-col rounded-lg bg-gray-100">
      <div className="flex flex-row items-center justify-between rounded-lg bg-gray-100 p-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>More Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              className="space-y-1"
              // value={position}
              // onValueChange={setPosition}
            >
              <DropdownMenuRadioItem
                value="top"
                className="flex cursor-pointer flex-row items-center gap-2 p-2"
              >
                <Plus className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Add Task
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                className="flex cursor-pointer flex-row items-center gap-2 p-2"
              >
                <Pencil className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Edit Column
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={handleColumnDelete}
                className="flex cursor-pointer flex-row items-center gap-2 p-2"
              >
                <Trash2 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Delete Column
                </span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="max-h-[80vh] overflow-y-scroll">
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex min-h-[150px] flex-col space-y-4 overflow-hidden p-4"
            >
              {tasks.map((task: any, index: number) => {
                return (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg- cursor-pointer rounded-lg p-2 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                      >
                        <div
                          className={`relative flex flex-col justify-start space-y-2 rounded-lg border-b-4 bg-white p-4 shadow-lg ${
                            task.priority === "HIGH"
                              ? "border-red-500"
                              : task.priority === "MEDIUM"
                                ? "border-yellow-500"
                                : "border-blue-500"
                          }`}
                        >
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
                          <div className="flex w-full flex-row items-center justify-between">
                            <h3 className="text-left text-lg font-bold">
                              {task.title}
                            </h3>
                            <Dialog>
                              <DialogTrigger className="">
                                <Info />
                              </DialogTrigger>
                              <DialogContent className="">
                                <DetailsModal task={task} />
                              </DialogContent>
                            </Dialog>
                          </div>
                          <p className="truncate text-left text-sm text-gray-600">
                            {task.description}
                          </p>

                          <div className="flex flex-row items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm text-red-500">
                              {timers[task._id] || "Loading..."}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
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
    </div>
  );
};

export default Column;
