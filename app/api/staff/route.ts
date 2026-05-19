import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

export async function GET() {
  await dbConnect();
  const staff = await Staff.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: staff });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const member = await Staff.create(body);
  return NextResponse.json({ success: true, data: member }, { status: 201 });
}
