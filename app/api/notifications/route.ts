import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Notification from "@/lib/models/Notification";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const branchName = url.searchParams.get("branchName");
    const branch = url.searchParams.get("branch");

    // Require either branchName or branch parameter for data security
    const userBranch = (branchName || branch || "").trim();
    if (!userBranch) {
      return NextResponse.json(
        {
          success: false,
          message: "Branch parameter is required",
        },
        {
          status: 400,
        }
      );
    }

    const filter: any = { branch: userBranch };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    });
  }
}