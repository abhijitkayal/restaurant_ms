// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/mongoose";
// import InventoryItem from "@/models/InventoryItem";

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const body = await req.json();
//   const item = await InventoryItem.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
//   if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
//   return NextResponse.json({ success: true, data: item });
// }

// export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const item = await InventoryItem.findByIdAndDelete(params.id);
//   if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
//   return NextResponse.json({ success: true, data: {} });
// }


import { NextResponse } from "next/server";

import {connectDB} from "@/lib/mongodb";

import Inventory from "../../../../lib/models/Inventory";
import Notification from "../../../../lib/models/Notification";

export async function PUT(
  request: any,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      productName,
      quantity,
      unit,
      branch,
    } = body;

    if (
      !productName?.trim() ||
      !quantity ||
      !unit ||
      !branch
    ) {
      return NextResponse.json({
        success: false,
        message:
          "All fields including branch are required",
      });
    }

    // Verify the inventory exists and belongs to the correct branch
    const existingInventory = await Inventory.findById(params.id);
    if (!existingInventory) {
      return NextResponse.json({
        success: false,
        message:
          "Inventory not found",
      });
    }

    // Ensure branch is not being changed
    if (existingInventory.branch !== branch) {
      return NextResponse.json({
        success: false,
        message:
          "Cannot change inventory branch",
      });
    }

    const updatedInventory =
      await Inventory.findByIdAndUpdate(
        params.id,
        {
          productName:
            productName.trim(),

          quantity:
            Number(quantity),

          unit,
        },
        {
          new: true,
        }
      );

    if (!updatedInventory) {
      return NextResponse.json({
        success: false,
        message:
          "Inventory not found",
      });
    }

    // Check for low stock after update
    if (Number(updatedInventory.quantity) <= 5) {
      const Notification = require("../../../../lib/models/Notification").default;
      await Notification.create({
        title: "Low Stock Alert",
        message: `${updatedInventory.productName} stock is low (${updatedInventory.quantity} ${updatedInventory.unit} left)`,
        type: "inventory",
        branch: updatedInventory.branch,
        managerRead: false,
        waiterRead: true,
        cookRead: false,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedInventory,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        "Failed to update inventory",
    });
  }
}