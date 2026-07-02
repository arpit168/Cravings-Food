import User from "../models/userModel.js";
import Restaurant from "../models/restaurantModel.js";
import Order from "../models/orderModel.js";
import Coupon from "../models/couponModel.js";

export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOwners = await User.countDocuments({ role: "restaurant_owner" });
    const totalPartners = await User.countDocuments({ role: "delivery_partner" });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ paymentStatus: "Paid" });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.totalAmount || 0), 0);

    const recentOrders = await Order.find()
      .populate("customerId", "fullName email")
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalPartners,
        totalRestaurants,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const toggleRestaurantFeatured = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }
    restaurant.isFeatured = !restaurant.isFeatured;
    await restaurant.save();

    res.status(200).json({ success: true, message: "Featured status updated", data: restaurant });
  } catch (error) {
    next(error);
  }
};
