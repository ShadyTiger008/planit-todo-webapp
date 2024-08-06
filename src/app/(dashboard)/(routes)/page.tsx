"use client";
import axios from "axios";
import {
  Edit,
  Edit3,
  ListTodo,
  MessagesSquare,
  Plus,
  PlusSquareIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateButton from "~/components/create-button";
import EditDescription from "~/components/edit-description";
import EditName from "~/components/edit-name";
import Heading from "~/components/heading";

type Props = {};

const Homepage = (props: Props) => {
  const [todoList, setTodoList] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  let user;

  if (typeof window !== "undefined") {
    user = JSON.parse(localStorage.getItem("User")!);
  }

  const getTodoList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/todo/getAllTodos/${user._id}`,
      );
      setTodoList(response.data.todoList);
      // console.log("Fetched todo list:", todoList);
    } catch (error) {
      console.error("Error fetching todo list:", error);
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      await axios.post(`http://localhost:3001/todo/delete/${user._id}`, {
        todoId: todoId,
      });
      toast.success("Deleted todo item successfully!");
      getTodoList();
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo!");
    }
  };

  const handleState = async (todoId: string) => {
    try {
      await axios.post(`http://localhost:3001/todo/updateState/${user._id}`, {
        todoId: todoId,
      });
      toast.success("Updated successfully!");
      getTodoList();
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error updating todo!");
    }
  };

  useEffect(() => {
    getTodoList();
    // console.log(todoList);
  }, [todoList, user]);

  const formattedDate = (date: string) => {
    const updatedDate = new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return updatedDate;
  };

  return (
    <main className="flex flex-col gap-5 px-5">
      <div className="flex flex-row justify-between">
        <Heading
          title="To-Do's"
          description="Create and update your todos"
          icon={ListTodo}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <CreateButton user={user} />
      </div>
      <section className="flex w-full flex-row flex-wrap justify-center gap-5">
        {todoList?.map((todo) => (
          <div
            key={todo?._id}
            className="flex h-fit w-[350px] flex-col gap-5 rounded-xl bg-white p-5 shadow-lg"
          >
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">{todo?.todoName}</h2>
              <EditName user={user} todoId={todo?._id} />
            </div>
            <p className="w-11/12 text-gray-700">{todo?.todoDescription}</p>
            <div className="flex flex-row items-center justify-between">
              <div
                className="flex cursor-pointer flex-col gap-1 text-center"
                onClick={() => handleState(todo?._id)}
              >
                <span className="text-xs text-gray-500">
                  {formattedDate(todo?.createdAt)}
                </span>
                {todo?.isCompleted ? (
                  <span className="rounded-full bg-green-500 px-5 py-2 text-center text-sm font-semibold text-white">
                    Completed
                  </span>
                ) : (
                  <span className="rounded-full bg-red-500 px-5 py-2 text-center text-sm font-semibold text-white">
                    Incomplete
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-3">
                <EditDescription user={user} todoId={todo?._id} />
                <Trash2Icon
                  className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(todo._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Homepage;
