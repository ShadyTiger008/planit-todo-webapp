"use client";
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
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {};

const CreateButton = ({ user }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      await axios.post(`http://localhost:3001/todo/create/${user._id}`, {
        todoName: data.title,
        todoDescription: data.description,
      });
      reset();
      toast.success("Todo created successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error creating new submission!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex h-10 flex-row items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2 text-white"
        >
          <span className="hidden md:block">Create New</span>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-left">
              Title
            </Label>
            <Input
              {...register("title")}
              type="text"
              placeholder="Ex: Review the codes"
            />
            {errors.title && <p>{`${errors.title.message}`}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="text-left">
              Description
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Ex: Review online accounts and update passwords for better security. Use a password manager to keep track."
            />
            {errors.description && <p>{`${errors.description.message}`}</p>}
          </div>
          <Button
            type="submit"
            variant="outline"
            className="h-8 w-full bg-black text-white hover:bg-black/70"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateButton;
