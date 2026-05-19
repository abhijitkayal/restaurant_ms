import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import User from "@/lib/models/User";

// GET USERS
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
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

    const users =
      await User.find({
        role: {
          $in: [
            "waiter",
            "cook",
          ],
        },
        branch: userBranch,
      }).sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);

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

// CREATE USER
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      name,
      email,
      password,
      role,
      avatar,
      branch,
    } = body;

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await User.findOne({
        email,
        branch,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists in this branch",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await User.create({
        name,

        email,

        password,

        role,
        branch: body.branch || "",

        avatar,
      });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);

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