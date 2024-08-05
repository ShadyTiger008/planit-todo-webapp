import React, { useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "../components/ElipsisMenu";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import boardsSlice from "../redux/boardsSlice";
import Subtask from "../components/Subtask";
import DeleteModal from "./delete-modal";
import AddEditTaskModal from "./add-edit-task-modal";

interface TaskModalProps {
  taskIndex: number;
  colIndex: number;
  setIsTaskModalOpen: (isOpen: boolean) => void;
}

interface SubtaskType {
  title: string;
  isCompleted: boolean;
}

interface TaskType {
  title: string;
  description: string;
  subtasks: SubtaskType[];
  status: string;
}

interface ColumnType {
  name: string;
  tasks: TaskType[];
}

interface BoardType {
  isActive: boolean;
  columns: ColumnType[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  taskIndex,
  colIndex,
  setIsTaskModalOpen,
}) => {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const boards = useSelector((state: { boards: BoardType[] }) => state.boards);
  const board = boards.find((board) => board.isActive);
  const columns = board?.columns || [];
  const col = columns.find((_, i) => i === colIndex);
  const task = col?.tasks.find((_, i) => i === taskIndex);
  const subtasks = task?.subtasks || [];

  const completed = subtasks.filter((subtask) => subtask.isCompleted).length;

  const [status, setStatus] = useState<string>(task?.status || "");
  const [newColIndex, setNewColIndex] = useState<number>(columns.indexOf(col!));

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    dispatch(
      boardsSlice.actions.setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      }),
    );
    setIsTaskModalOpen(false);
  };

  const onDeleteBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.textContent === "Delete") {
      dispatch(boardsSlice.actions.deleteTask({ taskIndex, colIndex }));
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className="scrollbar-hide dropdown fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center overflow-scroll px-2 py-4"
    >
      {/* MODAL SECTION */}

      <div className="scrollbar-hide mx-auto my-auto max-h-[95vh] w-full max-w-md overflow-y-scroll rounded-xl bg-white px-8 py-8 font-bold text-black shadow-md shadow-[#364e7e1a] dark:bg-[#2b2c37] dark:text-white">
        <div className="relative flex w-full items-center justify-between">
          <h1 className="text-lg">{task?.title}</h1>

          <img
            onClick={() => {
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="ellipsis"
            className="h-6 cursor-pointer"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className="pt-6 text-xs font-[600] tracking-wide text-gray-500">
          {task?.description}
        </p>

        <p className="pt-6 text-sm tracking-widest text-gray-500">
          Subtasks ({completed} of {subtasks.length})
        </p>

        {/* subtasks section */}

        <div className="mt-3 space-y-2">
          {subtasks.map((subtask, index) => (
            <Subtask
              index={index}
              taskIndex={taskIndex}
              colIndex={colIndex}
              key={index}
            />
          ))}
        </div>

        {/* Current Status Section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-gray-500 dark:text-white">
            Current Status
          </label>
          <select
            className="select-status flex-grow rounded-md border-[1px] border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-0 focus:outline-[#635fc7]"
            value={status}
            onChange={onChange}
          >
            {columns.map((col, index) => (
              <option className="status-options" key={index}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task?.title || ""}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
        />
      )}
    </div>
  );
};

export default TaskModal;
