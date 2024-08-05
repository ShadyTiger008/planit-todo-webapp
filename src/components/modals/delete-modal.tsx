import React, { MouseEventHandler } from "react";

interface DeleteModalProps {
  type: "task" | "board";
  title: string;
  onDeleteBtnClick: () => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  type,
  title,
  onDeleteBtnClick,
  setIsDeleteModalOpen,
}) => {
  const handleClickOutside: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    // Modal Container
    <div
      onClick={handleClickOutside}
      className="scrollbar-hide dropdown fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center overflow-scroll px-2 py-4"
    >
      {/* Delete Modal  */}
      <div className="scrollbar-hide mx-auto my-auto max-h-[95vh] w-full max-w-md overflow-y-scroll rounded-xl bg-white px-8 py-8 font-bold text-black shadow-md shadow-[#364e7e1a] dark:bg-[#2b2c37] dark:text-white">
        <h3 className="text-xl font-bold text-red-500">Delete this {type}?</h3>
        {type === "task" ? (
          <p className="pt-6 text-xs font-[600] tracking-wide text-gray-500">
            Are you sure you want to delete the "{title}" task and its subtasks?
            This action cannot be reversed.
          </p>
        ) : (
          <p className="pt-6 text-xs font-[600] tracking-wide text-gray-500">
            Are you sure you want to delete the "{title}" board? This action
            will remove all columns and tasks and cannot be reversed.
          </p>
        )}

        <div className="mt-4 flex w-full items-center justify-center space-x-4">
          <button
            onClick={onDeleteBtnClick}
            className="w-full items-center rounded-full bg-red-500 py-2 text-white hover:opacity-75"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="w-full items-center rounded-full bg-[#635fc71a] py-2 text-[#635fc7] hover:opacity-75 dark:bg-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
