import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" }, // Home, Work, Other
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "Maharashtra" },
  zip: { type: String, default: "400001" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "restaurant_owner", "delivery_partner", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    addresses: [addressSchema],
    walletBalance: {
      type: Number,
      default: 500, // ₹500 welcome bonus
    },
    loyaltyPoints: {
      type: Number,
      default: 150,
    },
    isOnline: {
      type: Boolean,
      default: true, // For delivery partners
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;