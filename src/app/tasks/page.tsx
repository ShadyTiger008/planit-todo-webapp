"use client";
import React from "react";
import useAuthStore from "../providers/store/authStore";
import { useGetQuery } from "../providers/query/getQuery";
import Link from "next/link";

type Props = {};

const BoardsTask = (props: Props) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  // console.log("User from global: ", user);

  const { data, isLoading: dataLoading } = useGetQuery({
    url: `/board?${user?._id}`,
  });
  console.log("Data after fetch: ", data?.data?.document);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 py-8">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">All Boards</h2>
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-md">
        {isLoading || dataLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
            <span className="text-lg text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.document?.length > 0 ? (
              data?.data?.document.map((board: any) => {
                console.log("Board: ", board);

                return (
                  <Link
                    href={`/tasks/${board._id}`}
                    key={board._id}
                    className="rounded-lg bg-blue-50 p-4 shadow transition-shadow duration-300 hover:shadow-lg"
                  >
                    <h3 className="text-xl font-medium text-blue-800">
                      {board.name}
                    </h3>
                    <p className="mt-2 text-gray-600">{board.description}</p>
                  </Link>
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
