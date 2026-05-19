import { NextRequest, NextResponse } from "next/server";

import {connectDB} from "@/lib/mongodb";

import Order from "@/models/Order";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const start =
      new Date();

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end =
      new Date();

    end.setHours(
      23,
      59,
      59,
      999
    );

    const branchName = req.nextUrl.searchParams.get("branchName");

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

    const query: any = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
      branch: branchName,
    };

    const orders = await Order.find(query);

    let totalRevenue = 0;

    let productMap: Record<string, any> = {};

    let paymentMap: Record<string, any> = {};

    orders.forEach((order) => {
      totalRevenue +=
        order.total || 0;

      // PRODUCT SALES
      order.items?.forEach(
        (item) => {
          if (
            productMap[
              item.name
            ]
          ) {
            productMap[
              item.name
            ] +=
              item.quantity;
          } else {
            productMap[
              item.name
            ] =
              item.quantity;
          }
        }
      );

      // PAYMENT TYPES
      const payment =
        order.paymentMethod ||
        "Cash";

      if (
        paymentMap[payment]
      ) {
        paymentMap[payment]++;
      } else {
        paymentMap[payment] = 1;
      }
    });

    const productSales =
      Object.keys(
        productMap
      ).map((key) => ({
        name: key,
        value:
          productMap[key],
      }));

    const paymentTypes =
      Object.keys(
        paymentMap
      ).map((key) => ({
        name: key,
        value:
          paymentMap[key],
      }));

    return NextResponse.json({
      success: true,

      data: {
        totalRevenue,

        totalOrders:
          orders.length,

        productSales,

        paymentTypes,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        "Failed to load dashboard",
    });
  }
}
