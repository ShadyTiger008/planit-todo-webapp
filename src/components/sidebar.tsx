"use client"
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardIcon from "~/app/assets/icon-board.svg";
import darkIcon from "~/app/assets/icon-dark-theme.svg";
import lightIcon from "~/app/assets/icon-light-theme.svg";
import showSidebarIcon from "~/app/assets/icon-show-sidebar.svg";
import hideSidebarIcon from "~/app/assets/icon-hide-sidebar.svg";
import boardsSlice from "~/app/redux/boardsSlice";
import { Switch } from "./ui/switch";
import AddEditBoardModal from "./modals/add-edit-board-modal";

interface SidebarProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSideBarOpen,
  setIsSideBarOpen,
}) => {
  const dispatch = useDispatch();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);

  const boards = useSelector((state: any) => state.boards.boards);

  const toggleSidebar = () => {
    setIsSideBarOpen((curr) => !curr);
  };

  return (
    <div>
      <div
        className={
          isSideBarOpen
            ? `fixed left-0 top-[72px] z-20 h-screen min-w-[261px] items-center bg-white dark:bg-[#2b2c37]`
            : `fixed bottom-10 top-auto flex h-[48px] w-[56px] transform cursor-pointer items-center justify-center rounded-r-full bg-[#635FC7] p-0 transition duration-300 hover:opacity-80 dark:bg-[#2b2c37] dark:hover:bg-[#635FC7]`
        }
      >
        <div>
          {/* Sidebar content */}
          {isSideBarOpen && (
            <div className="w-full rounded-xl bg-white py-4 dark:bg-[#2b2c37]">
              <h3 className="mx-4 mb-8 font-semibold text-gray-600 dark:text-gray-300">
                ALL BOARDS ({boards.length})
              </h3>

              <div className="dropdown-borad flex h-[70vh] flex-col justify-between">
                <div>
                  {boards.map((board, index) => (
                    <div
                      className={`mr-8 flex cursor-pointer items-baseline space-x-2 rounded-r-full px-5 py-4 duration-500 ease-in-out hover:bg-[#635fc71a] hover:text-[#635fc7] dark:text-white dark:hover:bg-white dark:hover:text-[#635fc7] ${
                        board.isActive
                          ? "rounded-r-full bg-[#635fc7] text-white"
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
                    className="mr-8 flex cursor-pointer items-baseline space-x-2 rounded-r-full px-5 py-4 text-[#635fc7] duration-500 ease-in-out hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white"
                    onClick={() => {
                      setIsBoardModalOpen(true);
                    }}
                  >
                    <img
                      src={boardIcon}
                      className="filter-white h-4"
                      alt="board icon"
                    />
                    <p className="text-lg font-bold">Create New Board</p>
                  </div>
                </div>

                <div className="relative mx-2 flex items-center justify-center space-x-2 rounded-lg bg-slate-100 p-4 dark:bg-[#20212c]">
                  <img src={lightIcon} alt="sun indicating light mode" />

                  {/* <Switch
                    checked={darkSide}
                    onChange={toggleDarkMode}
                    className={`${
                      darkSide ? "bg-[#635fc7]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable dark mode</span>
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
          )}

          {/* Sidebar hide/show toggle */}
          {isSideBarOpen ? (
            <div
              onClick={() => toggleSidebar()}
              className="absolute bottom-16 my-4 mb-8 mr-6 mt-2 flex cursor-pointer items-center justify-center space-x-2 rounded-r-full px-8 py-4 text-lg font-bold text-gray-500 hover:bg-[#635fc71a] hover:text-[#635FC7] dark:hover:bg-white"
            >
              <img
                className="min-w-[20px]"
                src={hideSidebarIcon}
                alt="hide sidebar icon"
              />
              {isSideBarOpen && <p>Hide Sidebar</p>}
            </div>
          ) : (
            <div className="absolute p-5" onClick={() => toggleSidebar()}>
              <img src={showSidebarIcon} alt="show sidebar icon" />
            </div>
          )}
        </div>
      </div>

      {isBoardModalOpen && (
        <AddEditBoardModal
          type="add"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
