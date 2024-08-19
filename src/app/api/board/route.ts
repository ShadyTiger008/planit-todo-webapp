import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/app/server/db";
import KanbanBoard from "~/app/server/models/board.model";

connectDB();

// GET Method: Retrieve boards based on filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;
    const boardId = searchParams.get("boardId") || "";
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";

    // Build query filters
    const filters: any = {};
    if (boardId) filters._id = boardId; // Filter by specific board ID
    if (userId) filters.userId = userId; // Filter by user ID
    if (search) filters.name = { $regex: search, $options: "i" }; // Search by name

    // Determine sorting order
    const sortOptions: any = {};
    if (sortBy === "createdAt") {
      sortOptions.createdAt = -1; // Sort by creation date, newest first
    } else if (sortBy === "updatedAt") {
      sortOptions.updatedAt = -1; // Sort by update date, newest first
    } else {
      sortOptions.createdAt = -1; // Default sort by creation date
    }

    // Fetch the boards based on filters, sort options, and pagination
    const boards = await KanbanBoard.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        message: "Boards retrieved successfully",
        data: {
          document: boards,
          totalCount: await KanbanBoard.countDocuments(filters),
          currentPage: page,
          limit,
        },
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

// POST Method: Create a new board
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
      { status: 201 }, // Status 201 for created resource
    );
  } catch (error: any) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT Method: Update an existing board
export async function PUT(request: NextRequest) {
  try {
    const { boardId, name, description, backgroundImage } =
      await request.json();

    // Check if the board with the given ID exists
    const existedBoard = await KanbanBoard.findById(boardId);
    if (!existedBoard) {
      return NextResponse.json(
        { success: false, message: "Board not found or may have been deleted" },
        { status: 404 },
      );
    }

    // Update the board with new details
    existedBoard.name = name || existedBoard.name;
    existedBoard.description = description || existedBoard.description;
    existedBoard.backgroundImage =
      backgroundImage || existedBoard.backgroundImage;
    await existedBoard.save();

    return NextResponse.json(
      {
        success: true,
        message: "Board successfully updated",
        data: existedBoard,
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

// DELETE Method: Delete a board by boardId
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const boardId = searchParams.get("boardId");

    // Check if boardId is provided
    if (!boardId) {
      return NextResponse.json(
        { success: false, message: "boardId is required" },
        { status: 400 },
      );
    }

    // Check if the board with the given ID exists
    const existedBoard = await KanbanBoard.findById(boardId);
    if (!existedBoard) {
      return NextResponse.json(
        { success: false, message: "Board not found" },
        { status: 404 },
      );
    }

    // Delete the board
    await KanbanBoard.findByIdAndDelete(boardId);

    return NextResponse.json(
      {
        success: true,
        message: "Board successfully deleted",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
