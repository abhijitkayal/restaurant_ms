import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Inventory from "@/lib/models/Inventory";
import Notification from "@/lib/models/Notification";

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

    const items =
      await Inventory.find(query).sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: items,
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

    // Validate required fields including branch
    if (!body.productName || !body.quantity || !body.unit || !body.branch) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: productName, quantity, unit, branch",
        },
        {
          status: 400,
        }
      );
    }

    // const item =
      // await Inventory.create(body);
  const item =
  await Inventory.create({
    productName: body.productName,
    quantity: body.quantity,
    unit: body.unit,
    branch: body.branch,
  });

if (Number(item.quantity) <= 5) {
  await Notification.create({
    title: "Low Stock Alert",
    message: `${item.productName} stock is low (${item.quantity} ${item.unit} left)`,
    type: "inventory",
    branch: body.branch,
    managerRead: false,
    waiterRead: true,
    cookRead: false,
  });
}

    return NextResponse.json({
      success: true,
      data: item,
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