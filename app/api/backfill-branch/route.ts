import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import Notification from "@/lib/models/Notification";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { action, branchMapping } = body;

    // action: "assign-users-to-branches" or "assign-orders-to-branches"
    // branchMapping: { userId: "branch", userId: "branch", ... }

    if (action === "assign-users-to-branches" && branchMapping) {
      // Update users with branch values
      for (const [userId, branch] of Object.entries(branchMapping)) {
        await User.findByIdAndUpdate(userId, { branch }, { new: true });
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${Object.keys(branchMapping).length} users with branches`,
      });
    }

    if (action === "assign-orders-to-branches" && branchMapping) {
      // Update orders with branch values based on order ID or manager ID
      for (const [orderId, branch] of Object.entries(branchMapping)) {
        await Order.findByIdAndUpdate(orderId, { branch }, { new: true });
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${Object.keys(branchMapping).length} orders with branches`,
      });
    }

    if (action === "list-users-without-branch") {
      // Get all users without a branch
      const usersWithoutBranch = await User.find({ branch: { $in: [null, ""] } });

      return NextResponse.json({
        success: true,
        count: usersWithoutBranch.length,
        users: usersWithoutBranch,
      });
    }

    if (action === "list-orders-without-branch") {
      // Get all orders without a branch
      const ordersWithoutBranch = await Order.find({ branch: { $in: [null, ""] } });

      return NextResponse.json({
        success: true,
        count: ordersWithoutBranch.length,
        orders: ordersWithoutBranch,
      });
    }

    if (action === "auto-assign-branches") {
      // Auto-assign branches to all users without a branch
      // Simple strategy: alternate between "Branch A", "Branch B", "Branch C"
      const branches = ["Branch A", "Branch B", "Branch C"];

      const usersWithoutBranch = await User.find({ branch: { $in: [null, ""] } });

      let index = 0;
      for (const user of usersWithoutBranch) {
        const branch = branches[index % branches.length];
        await User.findByIdAndUpdate(user._id, { branch }, { new: true });
        index++;
      }

      // Also update existing orders to match their manager's branch (if available)
      const allOrders = await Order.find({ branch: { $in: [null, ""] } });
      for (const order of allOrders) {
        const branch = branches[Math.floor(Math.random() * branches.length)];
        await Order.findByIdAndUpdate(order._id, { branch }, { new: true });
      }

      return NextResponse.json({
        success: true,
        message: `Auto-assigned branches to ${usersWithoutBranch.length} users and ${allOrders.length} orders`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Backfill error:", error);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
