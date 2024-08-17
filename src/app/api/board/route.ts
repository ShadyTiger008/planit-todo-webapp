import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/app/server/db";
import KanbanBoard from "~/app/server/models/board.model";
import mongoose from "mongoose";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;
    const boardId = parseInt(searchParams.get("boardId") || "");
    const search = parseInt(searchParams.get("search") || "");
    const userId = parseInt(searchParams.get("userId") || "");
    const sortBy = searchParams.get("sortBy") || "createdAt";

    // Build query filters
    const filters: any = {};
    if (userId) filters.userId = new mongoose.Types.ObjectId(userId);
    if (search) filters.name = { $regex: search, $options: "i" };

    // Determine sorting order
    const sortOptions: any = {};
    if (sortBy === "createdAt") {
      sortOptions.createdAt = -1; // Sort by createdAt, newest first
    } else if (sortBy === "updatedAt") {
      sortOptions.updatedAt = -1; // Sort by updatedAt, newest first
    } else {
      sortOptions.createdAt = -1; // Default sort by createdAt
    }

    // Fetch the boards based on filters and sort options
    const boards = await KanbanBoard.find(filters).sort(sortOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Boards retrieved successfully",
        data: boards,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error retrieving boards:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, userId } = await request.json();

    // Check if the board with the same name already exists for the user
    const existBoard = await KanbanBoard.findOne({ name, userId });
    if (existBoard) {
      return NextResponse.json(
        { success: false, message: "Board already exists" },
        { status: 400 },
      );
    }

    const newBoard = await KanbanBoard.create({
      name,
      description,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Board successfully created",
        data: newBoard,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { name, description, userId, boardId } = await request.json();

    // Check if the board with the given ID exists
    const existedBoard = await KanbanBoard.findById(boardId);
    if (!existedBoard) {
      return NextResponse.json(
        { success: false, message: "Board may have been deleted or removed" },
        { status: 400 },
      );
    }

    // Update the board with new details
    const updatedBoard = await KanbanBoard.findByIdAndUpdate(
      boardId,
      { name, description, userId },
      { new: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Board successfully updated",
        data: updatedBoard,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating board:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
