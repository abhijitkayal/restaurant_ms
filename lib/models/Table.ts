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

// Make tableNumber unique per branch (compound index)
TableSchema.index({ tableNumber: 1, branch: 1 }, { unique: true });

const Table =
  models.Table ||
  model("Table", TableSchema);

export default Table;