import mongoose from "mongoose";

const settingsSchema =
  new mongoose.Schema(
    {
      restaurantName: {
        type: String,
      },

      logo: {
        type: String,
      },

      address: {
        type: String,
      },

      accountNumber: {
        type: String,
      },

      ifscCode: {
        type: String,
      },

      branchName: {
        type: String,
      },

      gstNumber: {
        type: String,
      },

      phone: {
        type: String,
      },

      email: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Settings ||
  mongoose.model(
    "Settings",
    settingsSchema
  );