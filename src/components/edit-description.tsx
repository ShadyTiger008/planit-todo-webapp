// "use client"
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Edit } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  user: any;
  todoId: string;
};

const EditDescription = ({ user, todoId }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      await axios.post(
        `http://localhost:3001/todo/updateDescription/${user._id}`,
        {
          todoId: todoId,
          todoDescription: data.description,
        },
      );
      reset();
      toast.success("Successfully updated the description!");
    } catch (error) {
      console.log(error);
      toast.error("Error updating the description!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Edit className="flex h-5 w-5 cursor-pointer justify-end text-emerald-500 hover:text-emerald-700" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit todo description</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-left">
            Todo description
          </Label>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <Textarea
              {...register("description")}
              placeholder="Ex: Review online accounts and update passwords for better security. Use a password manager to keep track."
            />
            {errors.description && <p>{`${errors.description.message}`}</p>}
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

export default EditDescription;
