import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Coupon from "../models/couponModel.js";

export const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, couponCode, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      const error = new Error("Cart items cannot be empty");
      error.statusCode = 400;
      return next(error);
    }

    const formattedItems = items.map((i) => ({
      menuItemId: i.menuItemId || i.menuItem || i._id,
      name: i.name || "Gourmet Dish",
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      isVeg: i.isVeg !== undefined ? i.isVeg : true,
      selectedVariant: i.selectedVariant || {},
      selectedAddOns: i.selectedAddOns || [],
    }));

    let itemTotal = formattedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let deliveryFee = itemTotal > 499 ? 0 : 40;
    let packagingFee = 20;
    let gst = Math.round(itemTotal * 0.05); // 5% GST
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && itemTotal >= coupon.minOrderAmount) {
        discount = Math.min(
          Math.round((itemTotal * coupon.discountPercentage) / 100),
          coupon.maxDiscountAmount
        );
      }
    }

    let totalAmount = itemTotal + deliveryFee + packagingFee + gst - discount;

    // If payment method is wallet, check balance
    if (paymentMethod === "Wallet") {
      const user = await User.findById(req.user._id);
      if (user.walletBalance < totalAmount) {
        const error = new Error("Insufficient wallet balance. Please add funds or choose another payment method.");
        error.statusCode = 400;
        return next(error);
      }
      user.walletBalance -= totalAmount;
      await user.save();
    }

    const orderId = `CRV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await Order.create({
      orderId,
      customerId: req.user._id,
      restaurantId,
      items: formattedItems,
      pricing: {
        itemTotal,
        deliveryFee,
        packagingFee,
        gst,
        discount,
        totalAmount,
      },
      deliveryAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "Wallet" || paymentMethod === "Stripe" ? "Paid" : "Pending",
      orderStatus: "Placed",
      specialInstructions,
      couponCode: couponCode || "",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("restaurantId", "name image address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurantId", "name image address contact")
      .populate("deliveryPartnerId", "fullName mobileNumber avatar");

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );
    res.status(200).json({ success: true, message: `Order updated to ${status}`, data: order });
  } catch (error) {
    next(error);
  }
};
