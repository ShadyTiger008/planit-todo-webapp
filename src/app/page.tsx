// "use client" should be at the top for a client-side component
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Link from "next/link";
import EmptyBoard from "~/components/empty-board";
import Header from "~/components/header";
import Home from "~/components/home";
import { RootState } from "./redux/store"; // Import the RootState type from your store
import { setBoardActive } from "./redux/boardsSlice"; // Import the action directly

export default function HomePage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const allBoards = useSelector((state: RootState) => {
    console.log("Redux State:", state);
    return state.boards.boards;
  });
  const activeBoard = allBoards.length > 0 && allBoards.find((board) => board.isActive);

  if (!activeBoard && allBoards.length > 0) {
    dispatch(setBoardActive({ index: 0 }));
  }

  return (
    <div className="overflow-hidden overflow-x-scroll">
      <>
        {allBoards.length > 0 ? (
          <>
            <Header
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
            />
            <Home
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
            />
          </>
        ) : (
          <>
            <EmptyBoard type="add" />
          </>
        )}
      </>
    </div>
  );
}
