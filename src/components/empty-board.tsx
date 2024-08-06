"use client"
import React, { useState } from "react";
import AddEditBoardModal from "./modals/add-edit-board-modal";

interface EmptyBoardProps {
  type: "edit" | "view"; // Adjust this type based on your requirements
}

const EmptyBoard: React.FC<EmptyBoardProps> = ({ type }) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white dark:bg-[#2b2c37]">
      <h3 className="font-bold text-gray-500">
        {type === "edit"
          ? "This board is empty. Create a new column to get started."
          : "There are no boards available. Create a new board to get started"}
      </h3>
      <button
        onClick={() => setIsBoardModalOpen(true)}
        className="relative mt-8 w-full max-w-xs items-center rounded-full bg-[#635fc7] py-2 font-bold text-white hover:opacity-70 dark:bg-[#635fc7] dark:text-white"
      >
        {type === "edit" ? "+ Add New Column" : "+ Add New Board"}
      </button>
      {isBoardModalOpen && (
        <AddEditBoardModal
          type={type}
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
};

export default EmptyBoard;
