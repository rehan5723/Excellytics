import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String }, // Optional for Google users
  googleId: { type: String, unique: true, sparse: true }, // For Google Auth
  avatar: { type: String }, // Optional user profile picture
  role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.model("User", userSchema);
export default User;
