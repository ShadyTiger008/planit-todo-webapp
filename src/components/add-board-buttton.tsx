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
import { server_api, upload_api } from "~/app/config";
import { IoIosAddCircleOutline } from "react-icons/io";
import useAuthStore from "~/app/providers/store/authStore";

type Props = {
  refetch: () => void;
};

const AddBoardButton = ({ refetch }: Props) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (info: FieldValues) => {
    try {
      // Ensure background image is uploaded
      if (!backgroundImage) {
        toast.error("Background image is required.");
        return;
      }

      const body = {
        name: info.name,
        description: info.description,
        backgroundImage: backgroundImage,
        userId: user._id,
      };

      await axios.post(`${server_api}/board`, body); // API endpoint to add the board
      toast.success("Board added successfully!");
      refetch();
      reset(); // Reset the form
      setBackgroundImage(null); // Reset background image
    } catch (error: any) {
      console.log("Error:", error);
      toast.error("Failed to add board.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(upload_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setBackgroundImage(response.data.file); // Assuming the API returns { file: URL }
        toast.success("Background image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload background image.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex flex-row items-center gap-1">
          <IoIosAddCircleOutline className="h-5 w-5" />
          <span>Add Board</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg shadow-lg sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add New Board
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a new board by providing a name, description, and selecting a
            background image.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-3">
          {/* Name Input */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Board name is required" })}
              placeholder="Enter board name"
              className="rounded-md border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {/* {errors.name && (
              <span className="text-sm text-red-600">
                {errors.name.message}
              </span>
            )} */}
          </div>

          {/* Description Input */}
          <div className="flex flex-col space-y-1">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Input
              id="description"
              {...register("description", {
                required: "Board description is required",
              })}
              placeholder="Enter board description"
              className="rounded-md border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {/* {errors.description && (
              <span className="text-sm text-red-600">
                {errors.description.message}
              </span>
            )} */}
          </div>

          {/* Background Image Input */}
          <div className="flex flex-col space-y-1">
            <Label
              htmlFor="backgroundImage"
              className="text-sm font-medium text-gray-700"
            >
              Background Image
            </Label>
            <Input
              id="backgroundImage"
              type="file"
              {...register("backgroundImage", { required: true })}
              onChange={handleImageUpload}
              className="rounded-md border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.backgroundImage && (
              <span className="text-sm text-red-600">
                Background image is required
              </span>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full rounded-md bg-primary py-2 text-white shadow transition duration-300 ease-in-out hover:bg-primary/90"
            >
              Add Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardButton;
