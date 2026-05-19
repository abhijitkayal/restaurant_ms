import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const member = await Staff.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
  if (!member) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: member });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const member = await Staff.findByIdAndDelete(params.id);
  if (!member) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: {} });
}
