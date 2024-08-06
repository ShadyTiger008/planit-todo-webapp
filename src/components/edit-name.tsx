"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Edit3 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {};

const EditName = ({ user, todoId }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    console.log("User:", user);
    console.log("todo:", todoId);
    try {
      console.log(data);
      await axios.post(`http://localhost:3001/todo/updateName/${user._id}`, {
        todoId: todoId,
        todoName: data.title,
      });
      reset();
      toast.success("Successfully updated the title!");
    } catch (error) {
      console.log(error);
      toast.error("Error updating the title!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Edit3 className="h-4 w-4 cursor-pointer text-emerald-500 hover:text-emerald-700" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit todo title</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-left">
            Todo Title
          </Label>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <Input
              {...register("title")}
              type="text"
              placeholder="Ex: Review the codes"
            />
            {errors.title && <p>{`${errors.title.message}`}</p>}
            <Button
              type="submit"
              variant="outline"
              className="h-8 w-full bg-black text-white hover:bg-black/70"
            >
              Submit
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditName;
