import Coupon from "../models/couponModel.js";

export const getActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      const error = new Error("Please enter a coupon code");
      error.statusCode = 400;
      return next(error);
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      const error = new Error("Invalid or expired coupon code");
      error.statusCode = 404;
      return next(error);
    }

    if (amount < coupon.minOrderAmount) {
      const error = new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
      error.statusCode = 400;
      return next(error);
    }

    const discount = Math.min(
      Math.round((amount * coupon.discountPercentage) / 100),
      coupon.maxDiscountAmount
    );

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      data: {
        code: coupon.code,
        discount,
      },
    });
  } catch (error) {
    next(error);
  }
};
