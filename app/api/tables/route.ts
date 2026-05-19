// app/api/tables/route.ts

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Table from "@/lib/models/Table";

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const branchName = url.searchParams.get("branchName");
    const branch = url.searchParams.get("branch");

    // Require either branchName or branch parameter for data security
    const userBranch = branchName || branch;
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

    const query: any = { branch: userBranch };

    const tables = await Table.find(query).sort({
      tableNumber: 1,
    });

    return NextResponse.json({
      success: true,
      data: tables,
    });
  } catch (error) {
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

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    // require branch in body to scope tables per branch
    if (!body?.branch) {
      return NextResponse.json(
        { success: false, message: "branch is required" },
        { status: 400 }
      );
    }

    const table = await Table.create(body);

    return NextResponse.json({
      success: true,
      data: table,
    });
  } catch (error) {
    console.log(error);

    // handle duplicate key (unique index) errors
    // Mongo duplicate key error code is 11000
    const isDuplicate = (error as any)?.code === 11000;

    return NextResponse.json(
      {
        success: false,
        message: isDuplicate ? "Table with this number already exists for the branch" : "Failed to create table",
      },
      {
        status: isDuplicate ? 409 : 500,
      }
    );
  }
}