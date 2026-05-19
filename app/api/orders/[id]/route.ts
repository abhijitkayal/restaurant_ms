import {
  NextRequest,
  NextResponse,
} from "next/server";



import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

// GET single order by ID - used for bill generation
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}

// PUT update order status
export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.findById(
      params.id
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    // Update order status and payment info
    order.status =
      body.status || order.status;

    order.paymentStatus =
      body.paymentStatus ||
      order.paymentStatus;

    order.paymentMethod =
      body.paymentMethod ||
      order.paymentMethod;

    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE order
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    await Order.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete order",
      },
      {
        status: 500,
      }
    );
  }
}