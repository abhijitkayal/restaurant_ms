import { NextResponse } from "next/server";

import {connectDB} from "@/lib/mongodb";

import Menu from "../../../lib/models/Menu";

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const branch = url.searchParams.get("branch");

    const query: any = {};
    if (branch) {
      query.branch = branch;
    }

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

export async function POST(request: Request

) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      menuName,
      price,
      requirements,
      branch,
    } = body;

    if (
      !menuName ||
      !price ||
      !requirements.length
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Fill all fields",
      });
    }

    // Validate each requirement has product, unit, and valid quantity
    const validRequirements = requirements.filter(
      (r: any) => r.product && r.unit && r.quantity > 0
    );

    if (validRequirements.length === 0) {
      return NextResponse.json({
        success: false,
        message:
          "Each requirement must have product name, unit, and valid quantity",
      });
    }

    const menu =
      await Menu.create({
        menuName:
          menuName.trim(),

        price,

        requirements: validRequirements,

        branch,
      });

    return NextResponse.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        "Failed to create menu",
    });
  }
}
