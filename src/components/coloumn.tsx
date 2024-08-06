"use client"
import { shuffle } from "lodash";
import React, { useEffect, useState, DragEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "~/app/redux/boardsSlice";
import Task from "./task";

interface ColumnProps {
  colIndex: number;
}

interface TaskType {
  title: string;
  description: string;
  subtasks: SubtaskType[];
  status: string;
}

interface SubtaskType {
  title: string;
  isCompleted: boolean;
}

interface ColumnType {
  name: string;
  tasks: TaskType[];
}

interface BoardType {
  isActive: boolean;
  columns: ColumnType[];
}

const Column: React.FC<ColumnProps> = ({ colIndex }) => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];

  const dispatch = useDispatch();
  const [color, setColor] = useState<string | null>(null);
  const boards = useSelector((state: { boards: BoardType[] }) => state.boards.boards);
  const board = boards.find((board) => board.isActive);
  const col = board?.columns.find((_, i) => i === colIndex);

  useEffect(() => {
    setColor(shuffle(colors).pop() || null);
  }, [dispatch]);

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text"),
    );

    if (colIndex !== prevColIndex) {
      dispatch(
        boardsSlice.actions.dragTask({ colIndex, prevColIndex, taskIndex }),
      );
    }
  };

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="scrollbar-hide mx-5 min-w-[280px] pt-[90px]"
    >
      <p className="flex items-center gap-2 font-semibold tracking-widest text-[#828fa3] md:tracking-[.2em]">
        <div className={`h-4 w-4 rounded-full ${color}`} />
        {col?.name} ({col?.tasks.length})
      </p>

      {col?.tasks.map((task, index) => (
        <Task key={index} taskIndex={index} colIndex={colIndex} />
      ))}
    </div>
  );
};

export default Column;
