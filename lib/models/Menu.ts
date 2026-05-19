import mongoose from "mongoose";

const requirementSchema =
  new mongoose.Schema({
    product: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },
  });

const menuSchema =
  new mongoose.Schema(
    {
      menuName: {
        type: String,
        required: true,
        unique: true,
      },

      price: {
        type: Number,
        required: true,
      },

      requirements: [
        requirementSchema,
      ],

      branchName: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.Menu ||
  mongoose.model(
    "Menu",
    menuSchema
  );