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
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
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
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
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
    isApproved: {
      type: Boolean,
      default: true, // Customers automatically approved; partners & restaurants can be moderated by admin
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // Rider specific KYC & Vehicle Telemetry
    kycStatus: {
      type: String,
      enum: ["Not Submitted", "Pending", "Approved", "Rejected"],
      default: "Not Submitted",
    },
    vehicleType: {
      type: String,
      default: "Motorcycle",
    },
    vehicleNumber: {
      type: String,
      default: "MH-02-EE-9821",
    },
    drivingLicense: {
      type: String,
      default: "DL-MH-2022-90182",
    },
    aadharNumber: {
      type: String,
      default: "XXXX-XXXX-8921",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;