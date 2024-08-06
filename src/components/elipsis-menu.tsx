import React from "react";

interface ElipsisMenuProps {
  type: "Boards" | "Tasks"; // Adjust types according to your use case
  setOpenEditModal: () => void;
  setOpenDeleteModal: () => void;
}

const ElipsisMenu: React.FC<ElipsisMenuProps> = ({
  type,
  setOpenEditModal,
  setOpenDeleteModal,
}) => {
  return (
    <div
      className={
        type === "Boards" ? "absolute right-5 top-16" : "absolute right-4 top-6"
      }
    >
      <div className="flex items-center justify-end">
        <div className="z-50 h-auto w-40 space-y-4 rounded-lg bg-white px-4 py-5 pr-12 text-sm font-medium shadow-md shadow-[#364e7e1a] dark:bg-[#20212c]">
          <p
            onClick={() => {
              setOpenEditModal();
            }}
            className="cursor-pointer text-gray-700 dark:text-gray-400"
          >
            Edit {type}
          </p>

          <p
            onClick={() => setOpenDeleteModal()}
            className="cursor-pointer text-red-500"
          >
            Delete {type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ElipsisMenu;
