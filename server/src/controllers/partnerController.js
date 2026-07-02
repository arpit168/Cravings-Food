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
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    order.orderStatus = status;
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
      // Credit partner wallet ₹40 per delivery
      const partner = await User.findById(req.user._id);
      partner.walletBalance = (partner.walletBalance || 0) + 40;
      await partner.save();
    }
    await order.save();

    res.status(200).json({ success: true, message: `Delivery marked as ${status}`, data: order });
  } catch (error) {
    next(error);
  }
};
