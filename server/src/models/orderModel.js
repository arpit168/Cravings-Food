import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  isVeg: { type: Boolean, default: true },
  selectedVariant: {
    name: { type: String },
    price: { type: Number },
  },
  selectedAddOns: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [orderItemSchema],
    pricing: {
      itemTotal: { type: Number, required: true },
      deliveryFee: { type: Number, default: 40 },
      packagingFee: { type: Number, default: 20 },
      gst: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    deliveryAddress: {
      label: { type: String, default: "Home" },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "Maharashtra" },
      zip: { type: String, default: "400001" },
    },
    paymentMethod: {
      type: String,
      enum: ["Stripe", "Razorpay", "COD", "Wallet"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Preparing",
        "Ready for Pickup",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
    deliveryOtp: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    specialInstructions: {
      type: String,
      default: "",
    },
    couponCode: {
      type: String,
      default: "",
    },
    estimatedDeliveryTime: {
      type: String,
      default: "30-35 min",
    },
    refundStatus: {
      type: String,
      enum: ["None", "Requested", "Approved", "Rejected"],
      default: "None",
    },
    restaurantRating: {
      type: Number,
    },
    riderRating: {
      type: Number,
    },
    reviewText: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
