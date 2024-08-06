"use client"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "~/app/redux/boardsSlice";

interface SubtaskProps {
  index: number;
  taskIndex: number;
  colIndex: number;
}

const Subtask: React.FC<SubtaskProps> = ({ index, taskIndex, colIndex }) => {
  const dispatch = useDispatch();
  const boards = useSelector((state: any) => state.boards.boards);
  const board = boards.find((board: any) => board.isActive === true);
  const col = board?.columns.find((_, i) => i === colIndex);
  const task = col?.tasks.find((_, i) => i === taskIndex);
  const subtask = task?.subtasks.find((_, i) => i === index);
  const checked = subtask?.isCompleted || false;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      boardsSlice.actions.setSubtaskCompleted({ index, taskIndex, colIndex }),
    );
  };

  return (
    <div className="relative flex w-full items-center justify-start gap-4 rounded-md bg-[#f4f7fd] p-3 hover:bg-[#635fc740] dark:bg-[#20212c] dark:hover:bg-[#635fc740]">
      <input
        className="h-4 w-4 cursor-pointer accent-[#635fc7]"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <p className={checked ? "line-through opacity-30" : ""}>
        {subtask?.title}
      </p>
    </div>
  );
};

export default Subtask;
