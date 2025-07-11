import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }

);


const User = models.User || model("User", userSchema);

export default User;
