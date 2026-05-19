import { NextResponse } from "next/server";

import {connectDB} from "@/lib/mongodb";

import Menu from "../../../lib/models/Menu";

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const branchName = url.searchParams.get("branchName");

    // Require branchName parameter for data security
    if (!branchName) {
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

    const query: any = { branchName };

    const menus =
      await Menu.find(query).sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: menus,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
    });
  }
}

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      menuName,
      price,
      requirements,
      branchName,
    } = body;

    if (
      !menuName ||
      !price ||
      !requirements.length ||
      !branchName
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Fill all fields including branch",
      });
    }

    const menu =
      await Menu.create({
        menuName:
          menuName.trim(),

        price,

        requirements,

        branchName,
      });
      console.log(menu);

    return NextResponse.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.log(error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Menu name already exists",
      });
    }

    return NextResponse.json({
      success: false,
      message:
        "Failed to create menu",
    });
  }
}