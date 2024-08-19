import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/app/server/db";
import Status from "~/app/server/models/status.model";
import mongoose from "mongoose";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;
    const boardId = searchParams.get("boardId") || "";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";

    // Build query filters
    const filters: any = {};
    if (boardId) filters.boardId = new mongoose.Types.ObjectId(boardId);
    if (search) filters.title = { $regex: search, $options: "i" };

    // Determine sorting order
    const sortOptions: any = {};
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      sortOptions[sortBy] = -1; // Sort by createdAt or updatedAt, newest first
    } else {
      sortOptions.createdAt = -1; // Default sort by createdAt
    }

    // Fetch the Status based on filters and sort options
    const status = await Status.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        message: "Status retrieved successfully",
        data: status,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error retrieving Status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, boardId, color } = await request.json();

    // Check if the Status with the same title already exists for the board
    const existStatus = await Status.findOne({ title, boardId });
    if (existStatus) {
      return NextResponse.json(
        { success: false, message: "Status already exists" },
        { status: 400 },
      );
    }

    const newStatus = await Status.create({
      title,
      boardId: new mongoose.Types.ObjectId(boardId),
      color,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Status successfully created",
        data: newStatus,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating Status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { title, color, statusId } = await request.json();

    // Check if the Status with the given ID exists
    const existedStatus = await Status.findById(statusId);
    if (!existedStatus) {
      return NextResponse.json(
        { success: false, message: "Status may have been deleted or removed" },
        { status: 404 },
      );
    }

    // Update the Status with new details
    const updatedStatus = await Status.findByIdAndUpdate(
      statusId,
      { title, color },
      { new: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Status successfully updated",
        data: updatedStatus,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating Status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE Functionality
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const statusId = searchParams.get("statusId");
    const boardId = searchParams.get("boardId");

    // Delete a specific status by its ID
    if (statusId) {
      const deletedStatus = await Status.findByIdAndDelete(statusId);
      if (!deletedStatus) {
        return NextResponse.json(
          { success: false, message: "Status not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { success: true, message: "Status successfully deleted" },
        { status: 200 },
      );
    }

    // Delete all statuses associated with a specific boardId
    if (boardId) {
      const deletedStatuses = await Status.deleteMany({
        boardId: new mongoose.Types.ObjectId(boardId),
      });
      return NextResponse.json(
        {
          success: true,
          message: `${deletedStatuses.deletedCount} status(es) successfully deleted`,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, message: "No statusId or boardId provided" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Error deleting Status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
