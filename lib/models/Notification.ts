// import mongoose from "mongoose";

// const notificationSchema =
//   new mongoose.Schema(
//     {
//       title: String,

//       message: String,

//       type: String,

//       read: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// export default mongoose.models
//   .Notification ||
//   mongoose.model(
//     "Notification",
//     notificationSchema
//   );
import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      title: String,

      message: String,

      type: String,

      // MANAGER
      managerRead: {
        type: Boolean,
        default: false,
      },

      // WAITER
      waiterRead: {
        type: Boolean,
        default: false,
      },

      // COOK
      cookRead: {
        type: Boolean,
        default: false,
      },
      
      branch: String,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );