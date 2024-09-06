import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { server_api } from "~/app/config";

type Props = {
  boardId: string;
  refetch: () => void;
};

const AddColumnButton = ({ boardId, refetch }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [color, setColor] = useState("#ff0000"); // Initial color state

  const onSubmit = async (info: FieldValues) => {
    try {
      // Handle form submission
      const body = {
        title: info.title,
        color,
      };
      await axios.post(`${server_api}/board/${boardId}`, body); // API endpoint to add column
      toast.success("Column added successfully!");
      refetch();
      reset(); // Reset the form
    } catch (error: any) {
      console.log("Error:", error);
      toast.error(error.message);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex transform cursor-pointer flex-row items-center gap-2 rounded-full bg-primary px-4 py-2 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-primary/90">
          <Plus className="h-5 w-5 text-white" />
          <span className="text-xs md:text-sm font-medium text-white">Add Column</span>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-lg shadow-lg sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add New Column
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new column for your board by providing a title and
            selecting a color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {/* Title Input */}
          <div className="flex flex-col space-y-1">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Column Title
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter column title"
              className="rounded-md border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {/* {errors.title && (
              <span className="text-sm text-red-600">
                {errors.title.message}
              </span>
            )} */}
          </div>

          {/* Color Picker and Input */}
          <div className="flex flex-col space-y-1">
            <Label
              htmlFor="colorPicker"
              className="text-sm font-medium text-gray-700"
            >
              Select Color
            </Label>
            <div className="flex items-center gap-4">
              {/* Color Picker */}
              <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="h-12 w-12 cursor-pointer rounded-full border-none shadow"
              />
              {/* Hex Input */}
              <input
                id="colorInput"
                type="text"
                value={color}
                {...register("color", { required: "Color is required" })}
                onChange={(e) => setColor(e.target.value)}
                className="flex-grow rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
            {/* {errors.color && (
              <span className="text-sm text-red-600">
                {errors.color.message}
              </span>
            )} */}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-white shadow transition duration-300 ease-in-out hover:bg-blue-700"
            >
              Save Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnButton;
