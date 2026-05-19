import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Notification from "@/lib/models/Notification";

export async function PUT() {
  try {
    await connectDB();

    await Notification.updateMany(
      {
        read: false,
      },
      {
        $set: {
          read: true,
        },
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