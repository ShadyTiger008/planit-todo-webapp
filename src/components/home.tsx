import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./sidebar";
import EmptyBoard from "./empty-board";
import AddEditBoardModal from "./modals/add-edit-board-modal";
import Column from "./coloumn";

const Home: React.FC = () => {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    typeof window !== "undefined" ? window.innerWidth : 0,
    typeof window !== "undefined" ? window.innerHeight : 0,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    // Add event listener on mount
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowResize);
    }

    // Clean up the event listener on unmount
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleWindowResize);
      }
    };
  }, []);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);

  const boards = useSelector((state: any) => state.boards.boards);
  const board = boards?.find((board: any) => board.isActive === true);
  const columns = board ? board.columns : [];

  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  return (
    <div
      className={
        windowSize[0] >= 768 && isSideBarOpen
          ? "scrollbar-hide ml-[261px] flex h-screen gap-6 overflow-x-scroll bg-[#f4f7fd] dark:bg-[#20212c]"
          : "scrollbar-hide flex h-screen gap-6 overflow-x-scroll bg-[#f4f7fd] dark:bg-[#20212c]"
      }
    >
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {/* Columns Section */}
      {columns.length > 0 ? (
        <>
          {columns.map((col, index) => (
            <Column key={index} colIndex={index} />
          ))}
          <div
            onClick={() => setIsBoardModalOpen(true)}
            className="scrollbar-hide mx-5 mb-2 mt-[135px] flex h-screen min-w-[280px] cursor-pointer items-center justify-center rounded-lg bg-[#E9EFFA] pt-[90px] text-2xl font-bold text-[#828FA3] transition duration-300 hover:text-[#635FC7] dark:bg-[#2b2c3740]"
          >
            + New Column
          </div>
        </>
      ) : (
        <EmptyBoard type="edit" />
      )}
      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
};

export default Home;
