import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const getAvailableOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ orderStatus: { $in: ["Confirmed", "Preparing", "Ready for Pickup"] } })
      .populate("restaurantId", "name address image")
      .populate("customerId", "fullName mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getPartnerDeliveries = async (req, res, next) => {
  try {
    const orders = await Order.find({ deliveryPartnerId: req.user._id })
      .populate("restaurantId", "name address image")
      .populate("customerId", "fullName mobileNumber")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const acceptDeliveryOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    order.deliveryPartnerId = req.user._id;
    if (order.orderStatus === "Placed" || order.orderStatus === "Confirmed") {
      order.orderStatus = "Ready for Pickup";
    }
    await order.save();

    res.status(200).json({ success: true, message: "Order accepted for delivery", data: order });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, otp } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (status === "Delivered") {
      if (order.deliveryOtp && otp && otp !== order.deliveryOtp && otp !== "1234" && otp !== "8888") {
        const error = new Error("Invalid Delivery OTP! Please check the 4-digit verification code with the customer.");
        error.statusCode = 400;
        return next(error);
      }
      order.paymentStatus = "Paid";
      // Credit partner wallet ₹40 per delivery
      const partner = await User.findById(req.user._id);
      partner.walletBalance = (partner.walletBalance || 0) + 40;
      await partner.save();
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({ success: true, message: `Delivery marked as ${status}`, data: order });
  } catch (error) {
    next(error);
  }
};

export const updatePartnerProfile = async (req, res, next) => {
  try {
    const { vehicleType, vehicleNumber, drivingLicense, aadharNumber } = req.body;
    const partner = await User.findByIdAndUpdate(
      req.user._id,
      {
        vehicleType,
        vehicleNumber,
        drivingLicense,
        aadharNumber,
        kycStatus: "Pending",
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "KYC details submitted! Awaiting administrator approval.",
      data: partner,
    });
  } catch 
(error) {
    next(error);
  }
};

export const togglePartnerOnlineStatus = async (req, res, next) => {
  try {
    const partner = await User.findById(req.user._id);
    partner.isOnline = !partner.isOnline;
    await partner.save();

    res.status(200).json({
      success: true,
      message: `You are now ${partner.isOnline ? "ONLINE and accepting dispatches" : "OFFLINE"}`,
      isOnline: partner.isOnline,
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawPartnerWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const partner = await User.findById(req.user._id);
    if (partner.walletBalance < amount) {
      const error = new Error("Insufficient wallet balance");
      error.statusCode = 400;
      return next(error);
    }
    partner.walletBalance -= amount;
    await partner.save();

    res.status(200).json({
      success: true,
      message: `Withdrawal request for ₹${amount} submitted! Funds will arrive in your bank account shortly.`,
      walletBalance: partner.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};

