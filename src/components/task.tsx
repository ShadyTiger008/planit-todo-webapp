import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "./modals/task-modal";

interface TaskProps {
  colIndex: number;
  taskIndex: number;
}

const Task: React.FC<TaskProps> = ({ colIndex, taskIndex }) => {
  const boards = useSelector((state: any) => state.boards.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board?.columns || [];
  const col = columns.find((_, i) => i === colIndex);
  const task = col?.tasks.find((_, i) => i === taskIndex);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);

  const subtasks = task?.subtasks || [];
  let completed = subtasks.filter((subtask) => subtask.isCompleted).length;

  const handleOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex }),
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className="w-[280px] cursor-pointer rounded-lg bg-white px-3 py-6 shadow-lg shadow-[#364e7e1a] first:my-5 hover:text-[#635fc7] dark:bg-[#2b2c37] dark:text-white dark:hover:text-[#635fc7]"
      >
        <p className="font-bold tracking-wide">{task?.title}</p>
        <p className="mt-2 text-xs font-bold tracking-tighter text-gray-500">
          {completed} of {subtasks.length} completed tasks
        </p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
};

export default Task;
