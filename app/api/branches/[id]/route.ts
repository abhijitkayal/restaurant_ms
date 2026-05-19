import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Branch from "@/lib/models/Branch";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    await connectDB();

    const body = await req.json();

    const updateDoc = { $set: body };

    const branch = await Branch.findByIdAndUpdate(
      params.id,
      updateDoc,
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error("/api/branches/[id] PUT error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    await connectDB();

    await Branch.findByIdAndDelete(
      params.id
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("/api/branches/[id] DELETE error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}