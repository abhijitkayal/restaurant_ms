// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/mongoose";
// import Order from "@/models/Order";

// function generateOrderNumber(): string {
//   const ts = Date.now().toString(36).toUpperCase();
//   const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
//   return `ORD-${ts}-${rand}`;
// }

// export async function GET() {
//   await dbConnect();
//   const orders = await Order.find({}).sort({ createdAt: -1 }).populate("staffId", "name role");
//   return NextResponse.json({ success: true, data: orders });
// }

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   const body = await req.json();
//   const subtotal = body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
//   const tax = subtotal * 0.18;
//   const total = subtotal + tax;
//   const order = await Order.create({
//     ...body,
//     orderNumber: generateOrderNumber(),
//     subtotal,
//     tax,
//     total,
//   });
//   return NextResponse.json({ success: true, data: order }, { status: 201 });
// }



import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Order from "@/lib/models/Order";
import Notification from "@/lib/models/Notification";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // today start
    const today = new Date();

    today.setHours(0, 0, 0, 0);

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

    const q: any = {
      createdAt: { $gte: today },
      branch: userBranch,
    };

    // only today's orders (optionally filtered by branch)
    const orders = await Order.find(q).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { tableNumber, items, notes } = body;
    const branch = (body?.branch || "").trim();

    if (!branch) {
      return NextResponse.json(
        {
          success: false,
          message: "Branch is required",
        },
        {
          status: 400,
        }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    const tax = subtotal * 0.18;

    const total = subtotal + tax;

    // const order = await Order.create({
    //   orderNumber:
    //     "#" + Math.floor(1000 + Math.random() * 9000),

    //   tableNumber,

    //   items,

    //   notes,

    //   subtotal,

    //   tax,

    //   total,

    //   status: "Pending",

    //   paymentStatus: "Unpaid",
    // });


    const order = await Order.create({
  orderNumber:
    "#" + Math.floor(1000 + Math.random() * 9000),

  tableNumber,

  items,

  notes,

  subtotal,

  tax,

  total,

  status: "Pending",

  paymentStatus: "Unpaid",
  branch,
});

const totalItems =
  items.reduce(
    (
      sum: number,
      item: any
    ) =>
      sum + item.quantity,
    0
  );

await Notification.create({
  title: "New Order",
  message: `Table ${tableNumber} placed ${totalItems} items`,
  type: "order",
  branch,
  managerRead: false,
  waiterRead: false,
  cookRead: false,
});

console.log(
  "Notification saved"
);
    return NextResponse.json({
      success: true,
      data: order,
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