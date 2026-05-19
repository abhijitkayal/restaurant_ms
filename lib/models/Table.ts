import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const ChairSchema = new Schema({
  number: Number,

  occupied: {
    type: Boolean,
    default: false,
  },
});

const TableSchema = new Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    chairs: [ChairSchema],

    status: {
      type: String,

      enum: [
        "Available",
        "Occupied",
        "Reserved",
      ],

      default: "Available",
    },

    branch: String,
  },
  {
    timestamps: true,
  }
);

const Table =
  models.Table ||
  model("Table", TableSchema);

export default Table;