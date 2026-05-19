import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Table from "@/lib/models/Table";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      tableId,
      chairId,
      occupied,
    } = body;

    const table = await Table.findById(
      tableId
    );

    if (!table) {
      return NextResponse.json({
        success: false,
        message: "Table not found",
      });
    }

    const chair = table.chairs.id(
      chairId
    );

    if (!chair) {
      return NextResponse.json({
        success: false,
        message: "Chair not found",
      });
    }

    chair.occupied = occupied;

    await table.save();

    return NextResponse.json({
      success: true,
      message: "Chair updated",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
