import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["manager", "waiter", "cook","admin"],
    },

    branch: String,

    managerId: String,
  },
  {
    timestamps: true,
  }
);

// Compound unique index: email must be unique within a branch
UserSchema.index({ email: 1, branch: 1 }, { unique: true, sparse: true });

const User = models.User || model("User", UserSchema);

export default User;