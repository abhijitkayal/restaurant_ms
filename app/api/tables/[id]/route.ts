import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Table from "@/lib/models/Table";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await connectDB();

    const body = await req.json();

    const updatedTable =
      await Table.findByIdAndUpdate(
        params.id,
        {
          chairs: body.chairs,
        },
        {
          new: true,
        }
      );

    if (!updatedTable) {
      return NextResponse.json(
        {
          success: false,
          message: "Table not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTable,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error,
      },
      {
        status: 500,
      }
    );
  }
}