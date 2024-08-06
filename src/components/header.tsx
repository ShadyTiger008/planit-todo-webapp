"use client"
import React, { useState } from "react";
import Logo from "~/app/assets/logo-mobile.svg";
import iconDown from "~/app/assets/icon-chevron-down.svg";
import iconUp from "~/app/assets/icon-chevron-up.svg";
import elipsis from "~/app/assets/icon-vertical-ellipsis.svg";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "~/app/redux/boardsSlice";
import ElipsisMenu from "./elipsis-menu";
import HeaderDropDown from "./header-drop-down";
import AddEditTaskModal from "./modals/add-edit-task-modal";
import AddEditBoardModal from "./modals/add-edit-board-modal";
import DeleteModal from "./modals/delete-modal";

interface HeaderProps {
  setIsBoardModalOpen: (open: boolean) => void;
  isBoardModalOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  setIsBoardModalOpen,
  isBoardModalOpen,
}) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState<boolean>(false);
  const [boardType, setBoardType] = useState<"add" | "edit">("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const boards = useSelector((state: any) => state.boards.boards);
  const board = boards.find((board) => board.isActive);

  const onDropdownClick = () => {
    setOpenDropdown((state) => !state);
    setIsElipsisMenuOpen(false);
    setBoardType("add");
  };

  const setOpenEditModal = () => {
    setIsBoardModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const onDeleteBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.textContent === "Delete") {
      dispatch(boardsSlice.actions.deleteBoard());
      dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="fixed left-0 right-0 z-50 bg-white p-4 dark:bg-[#2b2c37]">
      <header className="flex items-center justify-between dark:text-white">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <img src={Logo} alt="Logo" className="h-6 w-6" />
          <h3 className="hidden font-sans font-bold md:inline-block md:text-4xl">
            kanban
          </h3>
          <div className="flex items-center">
            <h3 className="max-w-[200px] truncate font-sans text-xl font-bold md:ml-20 md:text-2xl">
              {board?.name}
            </h3>
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown icon"
              className="ml-2 w-3 md:hidden"
              onClick={onDropdownClick}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button
            className="button hidden md:block"
            onClick={() => setIsTaskModalOpen((prevState) => !prevState)}
          >
            + Add New Task
          </button>
          <button
            onClick={() => setIsTaskModalOpen((prevState) => !prevState)}
            className="button px-3 py-1 md:hidden"
          >
            +
          </button>

          <img
            onClick={() => {
              setBoardType("edit");
              setOpenDropdown(false);
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="ellipsis"
            className="h-6 cursor-pointer"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              type="Boards"
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
        </div>

        {openDropdown && (
          <HeaderDropDown
            setOpenDropdown={setOpenDropdown}
            setIsBoardModalOpen={setIsBoardModalOpen}
          />
        )}
      </header>
      {isTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          type="add"
          device="mobile"
        />
      )}

      {isBoardModalOpen && (
        <AddEditBoardModal
          setBoardType={setBoardType}
          type={boardType}
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="board"
          title={board?.name ?? ""}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )}
    </div>
  );
};

export default Header;
