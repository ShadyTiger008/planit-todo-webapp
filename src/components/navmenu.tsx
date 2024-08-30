import { Edit, Menu, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import useAuthStore from "~/app/providers/store/authStore";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server_api } from "~/app/config";

export function NavMenu() {
  const [boards, setBoards] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const getBoards = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get(
          `${server_api}/board?userId=${user?._id}`,
        );
        setBoards(response.data.data.document);
        setDataLoading(false);
      } catch (error) {
        console.log("Error occurred while fetching boards", error);
        toast.error("Failed to get boards");
        setDataLoading(false);
      }
    };
    getBoards();
  }, [user?._id]);

  // Memoize boards rendering to avoid unnecessary re-renders
  const boardList = useMemo(() => {
    return boards?.map((board: any) => (
      <Link
        href={`/tasks/${board._id}`}
        key={board._id}
        className="mb-3 flex items-center rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      >
        {/* Icon or Image Placeholder */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-lg font-semibold text-blue-500">
            {board.name.charAt(0)}
          </span>
        </div>

        {/* Board Name and Description */}
        <div className="ml-4 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">
            {board.name}
          </h3>
        </div>

        {/* Chevron for navigation */}
        <div className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    ));
  }, [boards]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Boards</SheetTitle>
          <SheetDescription>Manage your task boards below.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {dataLoading ? (
            <div className="flex items-center justify-center">
              <div className="loader h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500"></div>
              <span className="ml-4 text-gray-600">Loading...</span>
            </div>
          ) : boards?.length > 0 ? (
            <div className="w-full">{boardList}</div>
          ) : (
            <div className="text-center text-gray-600">No boards available</div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
