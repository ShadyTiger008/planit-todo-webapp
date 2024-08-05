import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import data from "../data.json";

// Define types
interface Subtask {
  title: string;
  isCompleted: boolean;
}

interface Task {
  title: string;
  description: string;
  subtasks: Subtask[];
  status: string;
}

interface Column {
  name: string;
  tasks: Task[];
}

interface Board {
  name: string;
  isActive: boolean;
  columns: Column[];
}

interface BoardsState {
  boards: Board[];
}

// Define initial state type
const initialState: BoardsState = {
  boards: data.boards,
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (
      state,
      action: PayloadAction<{ name: string; newColumns: Column[] }>,
    ) => {
      const isActive = state.boards.length === 0;
      const payload = action.payload;
      const board: Board = {
        name: payload.name,
        isActive,
        columns: payload.newColumns,
      };
      state.boards.push(board);
    },
    editBoard: (
      state,
      action: PayloadAction<{ name: string; newColumns: Column[] }>,
    ) => {
      const payload = action.payload;
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        board.name = payload.name;
        board.columns = payload.newColumns;
      }
    },
    deleteBoard: (state) => {
      const boardIndex = state.boards.findIndex((board) => board.isActive);
      if (boardIndex !== -1) {
        state.boards.splice(boardIndex, 1);
      }
    },
    setBoardActive: (state, action: PayloadAction<{ index: number }>) => {
      state.boards.forEach((board, index) => {
        board.isActive = index === action.payload.index;
      });
    },
    addTask: (
      state,
      action: PayloadAction<{
        title: string;
        status: string;
        description: string;
        subtasks: Subtask[];
        newColIndex: number;
      }>,
    ) => {
      const { title, status, description, subtasks, newColIndex } =
        action.payload;
      const task: Task = { title, description, subtasks, status };
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        const column = board.columns[newColIndex];
        if (column) {
          column.tasks.push(task);
        }
      }
    },
    editTask: (
      state,
      action: PayloadAction<{
        title: string;
        status: string;
        description: string;
        subtasks: Subtask[];
        prevColIndex: number;
        newColIndex: number;
        taskIndex: number;
      }>,
    ) => {
      const {
        title,
        status,
        description,
        subtasks,
        prevColIndex,
        newColIndex,
        taskIndex,
      } = action.payload;
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        const prevColumn = board.columns[prevColIndex];
        const task = prevColumn?.tasks[taskIndex];
        if (task) {
          task.title = title;
          task.status = status;
          task.description = description;
          task.subtasks = subtasks;

          if (prevColIndex !== newColIndex) {
            prevColumn.tasks.splice(taskIndex, 1);
            const newColumn = board.columns[newColIndex];
            if (newColumn) {
              newColumn.tasks.push(task);
            }
          }
        }
      }
    },
    dragTask: (
      state,
      action: PayloadAction<{
        colIndex: number;
        prevColIndex: number;
        taskIndex: number;
      }>,
    ) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        const prevColumn = board.columns[prevColIndex];
        const task = prevColumn?.tasks.splice(taskIndex, 1)[0];
        if (task) {
          const newColumn = board.columns[colIndex];
          if (newColumn) {
            newColumn.tasks.push(task);
          }
        }
      }
    },
    setSubtaskCompleted: (
      state,
      action: PayloadAction<{
        colIndex: number;
        taskIndex: number;
        index: number;
      }>,
    ) => {
      const { colIndex, taskIndex, index } = action.payload;
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        const column = board.columns[colIndex];
        const task = column?.tasks[taskIndex];
        if (task) {
          const subtask = task.subtasks[index];
          if (subtask) {
            subtask.isCompleted = !subtask.isCompleted;
          }
        }
      }
    },
    setTaskStatus: (
      state,
      action: PayloadAction<{
        status: string;
        colIndex: number;
        newColIndex: number;
        taskIndex: number;
      }>,
    ) => {
      const { status, colIndex, newColIndex, taskIndex } = action.payload;
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        const col = board.columns[colIndex];
        const task = col?.tasks[taskIndex];
        if (task) {
          task.status = status;
          col.tasks.splice(taskIndex, 1);

          if (colIndex !== newColIndex) {
            const newCol = board.columns[newColIndex];
            if (newCol) {
              newCol.tasks.push(task);
            }
          }
        }
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{ colIndex: number; taskIndex: number }>,
    ) => {
      const { colIndex, taskIndex } = action.payload;
      const board = state.boards.find((board) => board.isActive);
      if (board) {
        const column = board.columns[colIndex];
        if (column) {
          column.tasks.splice(taskIndex, 1);
        }
      }
    },
  },
});

export const {
  addBoard,
  editBoard,
  deleteBoard,
  setBoardActive,
  addTask,
  editTask,
  dragTask,
  setSubtaskCompleted,
  setTaskStatus,
  deleteTask,
} = boardsSlice.actions;
export default boardsSlice.reducer;
