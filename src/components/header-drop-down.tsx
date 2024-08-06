"use client"
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardIcon from "~/app/assets/icon-board.svg";
import darkIcon from "~/app/assets/icon-dark-theme.svg";
import lightIcon from "~/app/assets/icon-light-theme.svg";
import boardsSlice from "~/app/redux/boardsSlice";

interface HeaderDropDownProps {
  setOpenDropdown: (open: boolean) => void;
  setIsBoardModalOpen: (open: boolean) => void;
}

const HeaderDropDown: React.FC<HeaderDropDownProps> = ({
  setOpenDropdown,
  setIsBoardModalOpen,
}) => {
  const dispatch = useDispatch();

  const boards = useSelector((state: any) => state.boards.boards);

  return (
    <div
      className="dropdown absolute bottom-[-100vh] left-0 right-0 top-16 px-6 py-10"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      {/* DropDown Modal */}
      <div className="w-full rounded-xl bg-white py-4 shadow-md shadow-[#364e7e1a] dark:bg-[#2b2c37]">
        <h3 className="mx-4 mb-8 font-semibold text-gray-600 dark:text-gray-300">
          ALL BOARDS ({boards?.length})
        </h3>

        <div className="dropdown-board">
          {boards.map((board, index) => (
            <div
              className={`flex items-baseline space-x-2 px-5 py-4 ${
                board.isActive
                  ? "mr-8 rounded-r-full bg-[#635fc7] text-white"
                  : ""
              }`}
              key={index}
              onClick={() => {
                dispatch(boardsSlice.actions.setBoardActive({ index }));
              }}
            >
              <img
                src={boardIcon}
                className="filter-white h-4"
                alt="board icon"
              />
              <p className="text-lg font-bold">{board.name}</p>
            </div>
          ))}

          <div
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown(false);
            }}
            className="flex items-baseline space-x-2 px-5 py-4 text-[#635fc7]"
          >
            <img
              src={boardIcon}
              className="filter-white h-4"
              alt="board icon"
            />
            <p className="text-lg font-bold">Create New Board</p>
          </div>

          <div className="mx-2 flex items-center justify-center space-x-2 rounded-lg bg-slate-100 p-4 dark:bg-[#20212c]">
            <img src={lightIcon} alt="sun indicating light mode" />
            {/* <Switch
              checked={darkSide}
              onChange={toggleDarkMode}
              className={`${
                darkSide ? "bg-[#635fc7]" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  darkSide ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch> */}
            <img src={darkIcon} alt="moon indicating dark mode" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDropDown;
