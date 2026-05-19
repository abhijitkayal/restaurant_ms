import mongoose from "mongoose";

const branchSchema =
  new mongoose.Schema(
    {
      branchName: String,

      address: String,

      phone: String,

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