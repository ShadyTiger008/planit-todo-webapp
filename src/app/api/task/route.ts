import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "~/app/server/db";
import Task from "~/app/server/models/task.model";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      dueDate,
      status,
      boardId,
      image,
      tags,
      priority,
    } = await request.json();

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      status,
      boardId: new mongoose.Types.ObjectId(boardId),
      image,
      tags,
      priority,
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


export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;
    const skip = (page - 1) * limit;
    const boardId = searchParams.get("boardId") || "";
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const filters: any = { boardId: new mongoose.Types.ObjectId(boardId) };
    if (status) filters.status = status;
    if (search) filters.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        message: "Tasks retrieved successfully",
        data: {
          document: tasks,
          totalCount: await Task.countDocuments(filters),
          currentPage: page,
          limit,
        },
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


export async function PUT(request: NextRequest) {
  try {
    const {
      taskId,
      title,
      description,
      dueDate,
      status,
      completed,
      image,
      tags,
      priority,
    } = await request.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;
    task.status = status ?? task.status;
    task.completed = completed ?? task.completed;
    task.image = image ?? task.image;
    task.tags = tags ?? task.tags;
    task.priority = priority ?? task.priority;

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


export async function DELETE(request: NextRequest) {
  try {
   const searchParams = new URLSearchParams(request.nextUrl.searchParams);
   const taskId = (searchParams.get("taskId") || "");

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

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
