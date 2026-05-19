import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "../../../lib/mongodb";

import User from "../../../lib/models/User";

export async function POST(req: NextRequest) {
  try {

    await connectDB();
    console.log("Connected to DB");

    const body = await req.json();

    const { email, password } = body;

    const user = await User.findOne({
      email,
      password,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}