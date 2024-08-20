import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Status from "~/app/server/models/status.model";

export async function PUT(request: NextRequest) {
  try {
    const { columns } = await request.json(); // Expecting an array of columns with _id and order

    if (!Array.isArray(columns)) {
      return NextResponse.json(
        { success: false, message: "Invalid data format" },
        { status: 400 },
      );
    }

    // Validate all columns
    const columnsIds = columns.map((col) => col._id);
    const existingStatuses = await Status.find({ _id: { $in: columnsIds } });

    if (existingStatuses.length !== columns.length) {
      return NextResponse.json(
        { success: false, message: "Some columns were not found" },
        { status: 404 },
      );
    }

    // Update order for each status
    await Promise.all(
      columns.map(async (col, index) => {
        await Status.findByIdAndUpdate(col._id, { order: col.order });
      }),
    );

    return NextResponse.json(
      { success: true, message: "Column order updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating column order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
