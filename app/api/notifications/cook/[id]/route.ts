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

    const notification =
      await Notification.findByIdAndUpdate(
        params.id,
        {
          cookRead: true,
        },
        {
          new: true,
        }
      );

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
