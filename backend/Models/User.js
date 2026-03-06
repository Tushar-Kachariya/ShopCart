import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  contect: {
    type: Number,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user","admin"],
    default: "user"
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: String,
  otpExpire: Date
},
{ timestamps:true }
);

export default mongoose.model("User", userSchema);  