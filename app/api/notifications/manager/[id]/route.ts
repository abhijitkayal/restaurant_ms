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
    console.log("hello");
    const notification =
      await Notification.findByIdAndUpdate(
        params.id,
        {
          managerRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Notification not found",
        },
        {
          status: 404,
        }
      );
    }

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