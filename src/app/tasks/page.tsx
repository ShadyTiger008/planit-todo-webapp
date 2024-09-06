"use client";
import React from "react";
import useAuthStore from "../providers/store/authStore";
import { useGetQuery } from "../providers/query/getQuery";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import UserAvatar from "~/components/user-avatar";
import Image from "next/image";
import { board_api, client_api } from "../config";
import { Delete, Edit, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import AddBoardButton from "~/components/add-board-buttton";
import axios from "axios";
import EditBoardButton from "~/components/edit-board-button";

type Props = {};

const BoardsTask = (props: Props) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  console.log("User from global: ", user);

  const { data, isLoading: dataLoading, refetch } = useGetQuery({
    url: `/board?userId=${user?._id}`,
  });
  // console.log("Data after fetch: ", data?.data?.document);

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-10 bg-gray-100 py-8">
      <nav className="flex w-full flex-row items-center justify-between px-5 md:px-10">
        <h2 className="text-lg md:text-3xl font-semibold text-gray-800">All Boards</h2>
        <div className="flex flex-row gap-5">
         
          <AddBoardButton refetch={refetch}/>
          <UserAvatar />
        </div>
      </nav>
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-md">
        {isLoading || dataLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
            <span className="text-lg text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {data?.data?.document?.length > 0 ? (
              data?.data?.document.map((board: any) => {
                return (
                  <div
                    key={board._id}
                    className="relative overflow-hidden rounded-lg bg-blue-50 shadow transition-shadow duration-300 hover:shadow-lg"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={`${client_api}/${board.backgroundImage}`}
                        alt="Board Image"
                        fill
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>{" "}
                      {/* Overlay for better text visibility */}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                      <div className="flex flex-row items-center justify-between">
                        <Link
                          href={`/tasks/${board._id}`}
                          className="text-lg md:text-2xl font-bold"
                        >
                          {board.name}
                        </Link>
                        <div className="flex items-center gap-4">
                          <EditBoardButton refetch={refetch} boardId={board._id} boardName={board.name} boardDescription={board.description}/>
                          <button
                            className="flex h-8 md:h-10 w-8 md:w-10 items-center justify-center rounded-full bg-red-100 text-red-600 shadow transition duration-200 ease-in-out hover:bg-red-200"
                            aria-label="Delete"
                            onClick={async () => {
                              await axios.delete(
                                `${board_api}?boardId=${board._id}`,
                              );
                              refetch()
                            }}
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm md:text-lg">{board.description}</p>

                      <div className="mt-6 flex flex-row items-center justify-between">
                        <div className="mb-2">
                          <h4 className="text-xs md:text-sm font-semibold">Created At:</h4>
                          <p className="text-sm md:text-base">{new Date(board.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-semibold">Updated At:</h4>
                          <p className="text-sm md:text-base">{new Date(board.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-600">
                No boards available
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default BoardsTask;
