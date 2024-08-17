import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "~/app/server/db";
import Task from "~/app/server/models/task.model";

connectDB();

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    const { title, description, dueDate, status, boardId } =
      await request.json();

    // Create a new task
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      status,
      boardId: new mongoose.Types.ObjectId(boardId),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task successfully created",
        data: newTask,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// GET - Retrieve tasks with search and filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;
    const boardId = parseInt(searchParams.get("boardId") || "");
    const status = parseInt(searchParams.get("status") || "");
    const search = parseInt(searchParams.get("search") || "");

    // Build query filters
    const filters: any = { boardId: new mongoose.Types.ObjectId(boardId) };
    if (status) filters.status = status;
    if (search) filters.title = { $regex: search, $options: "i" };

    // Find tasks based on filters
    const tasks = await Task.find(filters).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Tasks retrieved successfully",
        data: tasks,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error retrieving tasks:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT - Update a task
export async function PUT(request: NextRequest) {
  try {
    const { taskId, title, description, dueDate, status, completed } =
      await request.json();

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    // Update task details
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;
    task.status = status ?? task.status;
    task.completed = completed ?? task.completed;

    const updatedTask = await task.save();

    return NextResponse.json(
      {
        success: true,
        message: "Task successfully updated",
        data: updatedTask,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Remove a task
export async function DELETE(request: NextRequest) {
  try {
    const { taskId } = await request.json();

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    // Remove the task
    await task.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: "Task successfully deleted",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
