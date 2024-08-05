import React, { useState, ChangeEvent, MouseEvent } from "react";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the import path as needed

interface Column {
  name: string;
  tasks: any[]; // Define a proper type for tasks if possible
  id: string;
}

interface Board {
  name: string;
  columns: Column[];
  isActive: boolean;
}

interface Props {
  setIsBoardModalOpen: (isOpen: boolean) => void;
  type: "add" | "edit";
}

const AddEditBoardModal: React.FC<Props> = ({ setIsBoardModalOpen, type }) => {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState<string>("");
  const [newColumns, setNewColumns] = useState<Column[]>([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "Doing", tasks: [], id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);

  // Ensure the state has a type defined
  const board = useSelector((state: RootState) =>
    state.boards.find((board) => board.isActive),
  );

  // Use a type guard to handle `undefined` values
  if (type === "edit" && isFirstLoad && board) {
    setNewColumns(
      board.columns.map((col) => ({
        ...col,
        id: uuidv4(),
      })),
    );
    setName(board.name);
    setIsFirstLoad(false);
  }

  const validate = (): boolean => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }
    for (const column of newColumns) {
      if (!column.name.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  const onChange = (id: string, newValue: string) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      if (column) {
        column.name = newValue;
      }
      return newState;
    });
  };

  const onDelete = (id: string) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = (type: "add" | "edit") => {
    setIsBoardModalOpen(false);
    if (type === "add") {
      dispatch(boardsSlice.actions.addBoard({ name, newColumns }));
    } else {
      dispatch(boardsSlice.actions.editBoard({ name, newColumns }));
    }
  };

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsBoardModalOpen(false);
    }
  };

  return (
    <div
      className="scrollbar-hide dropdown fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center overflow-scroll px-2 py-4"
      onClick={handleClickOutside}
    >
      <div className="scrollbar-hide mx-auto my-auto max-h-[95vh] w-full max-w-md overflow-y-scroll rounded-xl bg-white px-8 py-8 font-bold text-black shadow-md shadow-[#364e7e1a] dark:bg-[#2b2c37] dark:text-white">
        <h3 className="text-lg">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500 dark:text-white">
            Board Name
          </label>
          <input
            className="rounded-md border-[0.5px] border-gray-600 bg-transparent px-4 py-2 text-sm outline-1 ring-0 focus:outline-[#635fc7]"
            placeholder="e.g Web Design"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            id="board-name-input"
          />
        </div>

        {/* Board Columns */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-gray-500 dark:text-white">
            Board Columns
          </label>

          {newColumns.map((column, index) => (
            <div key={index} className="flex w-full items-center">
              <input
                className="flex-grow rounded-md border-[0.5px] border-gray-600 bg-transparent px-4 py-2 text-sm outline-[1px] focus:outline-[#635fc7]"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onChange(column.id, e.target.value);
                }}
                type="text"
                value={column.name}
              />
              <img
                src={crossIcon}
                onClick={() => {
                  onDelete(column.id);
                }}
                className="m-4 cursor-pointer"
                alt="Delete column"
              />
            </div>
          ))}
          <div>
            <button
              className="w-full items-center rounded-full bg-[#635fc7] py-2 text-white hover:opacity-70 dark:bg-white dark:text-[#635fc7]"
              onClick={() => {
                setNewColumns((state) => [
                  ...state,
                  { name: "", tasks: [], id: uuidv4() },
                ]);
              }}
            >
              + Add New Column
            </button>
            <button
              onClick={() => {
                const isValid = validate();
                if (isValid) onSubmit(type);
              }}
              className="relative mt-8 w-full items-center rounded-full bg-[#635fc7] py-2 text-white hover:opacity-70 dark:bg-[#635fc7] dark:text-white"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBoardModal;
