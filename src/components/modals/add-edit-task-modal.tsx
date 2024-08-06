"use client"
import React, { useState, ChangeEvent, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "~/app/assets/icon-cross.svg";
import boardsSlice from "~/app/redux/boardsSlice";

interface Subtask {
  title: string;
  isCompleted: boolean;
  id: string;
}

interface Column {
  name: string;
  tasks: Task[];
}

interface Task {
  title: string;
  description: string;
  subtasks: Subtask[];
}

interface Props {
  type: "add" | "edit";
  device: "mobile" | "desktop";
  setIsTaskModalOpen: (isOpen: boolean) => void;
  setIsAddTaskModalOpen: (isOpen: boolean) => void;
  taskIndex: number;
  prevColIndex?: number;
}

const AddEditTaskModal: React.FC<Props> = ({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) => {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [newColIndex, setNewColIndex] = useState<number>(prevColIndex);
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);

  const board = useSelector((state: RootState) =>
    state.boards.boards.find((board) => board.isActive),
  );

  if (!board) return null; // Handle case where board is not found

  const columns = board.columns;
  const col = columns.find((_:any, index:number) => index === prevColIndex);
  const task = col
    ? col.tasks.find((_:any, index:number) => index === taskIndex)
    : undefined;

  if (type === "edit" && isFirstLoad && task) {
    setSubtasks(
      task.subtasks.map((subtask: any) => ({
        ...subtask,
        id: uuidv4(),
      })),
    );
    setTitle(task.title);
    setDescription(task.description);
    setStatus(columns[prevColIndex].name);
    setIsFirstLoad(false);
  }

  const onChangeSubtasks = (id: string, newValue: string) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      if (subtask) {
        subtask.title = newValue;
      }
      return newState;
    });
  };

  const onChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const validate = (): boolean => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }
    for (const subtask of subtasks) {
      if (!subtask.title.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  const onDelete = (id: string) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = (type: "add" | "edit") => {
    if (type === "add") {
      dispatch(
        boardsSlice.actions.addTask({
          title,
          description,
          subtasks,
          status,
          newColIndex,
        }),
      );
    } else {
      dispatch(
        boardsSlice.actions.editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        }),
      );
    }
  };

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsAddTaskModalOpen(false);
    }
  };

  return (
    <div
      className={
        device === "mobile"
          ? "dropdown absolute bottom-[-100vh] left-0 right-0 top-0 flex overflow-y-scroll px-6 py-6 pb-40"
          : "dropdown absolute bottom-0 left-0 right-0 top-0 flex overflow-y-scroll px-6 py-6 pb-40"
      }
      onClick={handleClickOutside}
    >
      <div className="scrollbar-hide mx-auto my-auto max-h-[95vh] w-full max-w-md overflow-y-scroll rounded-xl bg-white px-8 py-8 font-bold text-black shadow-md shadow-[#364e7e1a] dark:bg-[#2b2c37] dark:text-white">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500 dark:text-white">
            Task Name
          </label>
          <input
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            id="task-name-input"
            type="text"
            className="rounded-md border-[0.5px] border-gray-600 bg-transparent px-4 py-2 text-sm outline-none outline-1 ring-0 focus:border-0 focus:outline-[#635fc7]"
            placeholder="e.g Take coffee break"
          />
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500 dark:text-white">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            id="task-description-input"
            className="min-h-[200px] rounded-md border-[0.5px] border-gray-600 bg-transparent px-4 py-2 text-sm outline-none outline-[1px] focus:border-0 focus:outline-[#635fc7]"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </div>

        {/* Subtasks */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-gray-500 dark:text-white">
            Subtasks
          </label>

          {subtasks.map((subtask, index) => (
            <div key={index} className="flex w-full items-center">
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onChangeSubtasks(subtask.id, e.target.value)
                }
                type="text"
                value={subtask.title}
                className="flex-grow rounded-md border-[0.5px] border-gray-600 bg-transparent px-4 py-2 text-sm outline-none outline-[1px] focus:border-0 focus:outline-[#635fc7]"
                placeholder="e.g Take coffee break"
              />
              <img
                src={crossIcon}
                onClick={() => onDelete(subtask.id)}
                className="m-4 cursor-pointer"
                alt="Delete subtask"
              />
            </div>
          ))}

          <button
            className="w-full items-center rounded-full bg-[#635fc7] py-2 text-white dark:bg-white dark:text-[#635fc7]"
            onClick={() =>
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuidv4() },
              ])
            }
          >
            + Add New Subtask
          </button>
        </div>

        {/* Current Status */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-gray-500 dark:text-white">
            Current Status
          </label>
          <select
            value={status}
            onChange={onChangeStatus}
            className="select-status flex-grow rounded-md border-[1px] border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-0 focus:outline-[#635fc7]"
          >
            {columns.map((column:any, index: number) => (
              <option key={index} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setIsAddTaskModalOpen(false);
                if (type === "edit") {
                  setIsTaskModalOpen(false);
                }
              }
            }}
            className="w-full items-center rounded-full bg-[#635fc7] py-2 text-white"
          >
            {type === "edit" ? "Save Edit" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
