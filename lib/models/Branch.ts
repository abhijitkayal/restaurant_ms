import mongoose from "mongoose";

const branchSchema =
  new mongoose.Schema(
    {
      branchName: String,

      restaurantName: String,

      address: String,

      phone: String,

      email: String,

      trackingEmail: String,

      accountNo: String,

      ifscCode: String,

      gstin: String,

      logoUrl: String,

      logoPublicId: String,

      managerName: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Branch ||
  mongoose.model(
    "Branch",
    branchSchema
  );