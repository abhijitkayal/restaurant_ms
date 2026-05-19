import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Branch from "../../../lib/models/Branch";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const branchName = req.nextUrl.searchParams.get("branchName");
    const trackingEmail = req.nextUrl.searchParams.get("trackingEmail");

    const query: Record<string, string> = {};

    if (branchName) {
      query.branchName = branchName;
    }

    if (trackingEmail) {
      query.trackingEmail = trackingEmail;
    }

    const branches = await Branch.find(query);

    return NextResponse.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error("/api/branches GET error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const branchName = body?.branchName?.trim();
    const trackingEmail = body?.trackingEmail?.trim();

    const query: Record<string, string> = {};

    if (branchName) {
      query.branchName = branchName;
    }

    if (trackingEmail) {
      query.trackingEmail = trackingEmail;
    }

    const updateDoc = { $set: body };

    const branch = await Branch.findOneAndUpdate(
      query,
      updateDoc,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error("/api/branches POST error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}