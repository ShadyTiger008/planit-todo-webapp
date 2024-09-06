// @ts-ignore
// @ts-nocheck

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
import { Edit, Plus } from "lucide-react";
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
  boardId: string
  boardName: string
  boardDescription: string;
};

const EditBoardButton = ({ refetch, boardId, boardName, boardDescription }: Props) => {
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
      // Check if at least one field is filled
      if (!info.name && !info.description && !backgroundImage) {
        toast.error(
          "At least one field (name, description, or background image) is required.",
        );
        return;
      }

      const body = {
        name: info.name,
        description: info.description,
        backgroundImage: backgroundImage,
        boardId: boardId,
      };

      await axios.put(`${server_api}/board`, body);
      toast.success("Board updated successfully!");
      refetch();
      reset();
      setBackgroundImage(null);
    } catch (error: any) {
      console.log("Error:", error);
      toast.error("Failed to update board.");
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
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow transition duration-200 ease-in-out hover:bg-blue-200"
          aria-label="Edit"
        >
          <Edit className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg shadow-lg sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Edit A Board
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Edit a board by providing a name, description, and selecting a
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
              {...register("name")}
              placeholder={boardName}
              className="rounded-md border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

            {errors.name && (
              <span className="text-sm text-red-600">
                {errors.name.message}
              </span>
            )}
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
              {...register("description")}
              placeholder={boardDescription}
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
              {...register("backgroundImage")}
              onChange={handleImageUpload}
              className="rounded-md border p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full rounded-md bg-primary py-2 text-white shadow transition duration-300 ease-in-out hover:bg-primary/90"
            >
              Edit Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBoardButton;
