import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Branch from "../../../lib/models/Branch";

export async function GET() {
  try {
    await connectDB();

    const branches =
      await Branch.find();

    return NextResponse.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
    });
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const branch =
      await Branch.create(body);

    return NextResponse.json({
      success: true,
      data: branch,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
    });
  }
}