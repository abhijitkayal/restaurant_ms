import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Notification from "@/lib/models/Notification";

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

    await Notification.findByIdAndUpdate(
      params.id,
      {
        read: true,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
    });
  }
}