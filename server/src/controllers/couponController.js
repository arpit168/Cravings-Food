import Coupon from "../models/couponModel.js";

/**
 * Helper to throw formatted HTTP errors
 */
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Get all active and non-expired coupons
 */
export const getActiveCoupons = async (req, res, next) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiresAt: { $gt: now } },
        { expiresAt: { $exists: false } }, // Handles coupons without expiration dates
      ],
    }).select("-__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validate a coupon code against order amount
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { amount } = req.body;
    let { code } = req.body;

    // 1. Validate inputs
    if (!code || typeof code !== "string" || !code.trim()) {
      return next(createError("Please provide a valid coupon code", 400));
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return next(
        createError("Please provide a valid positive order amount", 400),
      );
    }

    // 2. Format code (trim spaces and convert to uppercase)
    code = code.trim().toUpperCase();

    // 3. Find active and non-expired coupon
    const now = new Date();
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      $or: [{ expiresAt: { $gt: now } }, { expiresAt: { $exists: false } }],
    });

    if (!coupon) {
      return next(createError("Invalid or expired coupon code", 404));
    }

    // 4. Check minimum order amount requirement
    const minOrder = coupon.minOrderAmount || 0;
    if (parsedAmount < minOrder) {
      return next(
        createError(
          `Minimum order amount of ₹${minOrder} is required for this coupon`,
          400,
        ),
      );
    }

    // 5. Calculate discount safely (handles capped and uncapped discounts)
    let calculatedDiscount = Math.round(
      (parsedAmount * coupon.discountPercentage) / 100,
    );

    if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
      calculatedDiscount = Math.min(
        calculatedDiscount,
        coupon.maxDiscountAmount,
      );
    }

    // Prevent discount from exceeding total order amount
    const discount = Math.min(calculatedDiscount, parsedAmount);
    const finalAmount = Math.max(0, parsedAmount - discount);

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      data: {
        code: coupon.code,
        discount,
        originalAmount: parsedAmount,
        finalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};
