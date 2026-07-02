import Restaurant from "../models/restaurantModel.js";
import MenuItem from "../models/menuItemModel.js";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";

export const getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, isPureVeg, rating, sortBy } = req.query;
    let query = { isOpen: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { cuisines: { $regex: search, $options: "i" } },
      ];
    }

    if (cuisine && cuisine !== "All") {
      query.cuisines = { $in: [new RegExp(cuisine, "i")] };
    }

    if (isPureVeg === "true") {
      query.isPureVeg = true;
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortOption = {};
    if (sortBy === "rating") sortOption.rating = -1;
    else if (sortBy === "deliveryTime") sortOption.deliveryTime = 1;
    else if (sortBy === "costLowToHigh") sortOption.costForTwo = 1;
    else if (sortBy === "costHighToLow") sortOption.costForTwo = -1;
    else sortOption.isFeatured = -1;

    const restaurants = await Restaurant.find(query).sort(sortOption);
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }

    const menuItems = await MenuItem.find({ restaurantId: restaurant._id, isAvailable: true });
    const reviews = await Review.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        menuItems,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const newRestaurant = await Restaurant.create({
      ...req.body,
      ownerId: req.user._id,
    });
    res.status(201).json({ success: true, message: "Restaurant created", data: newRestaurant });
  } catch (error) {
    next(error);
  }
};

export const addMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json({ success: true, message: "Menu item added", data: newItem });
  } catch (error) {
    next(error);
  }
};

export const getOwnerRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.user._id });
    const restaurantIds = restaurants.map((r) => r._id);
    const menuItems = await MenuItem.find({ restaurantId: { $in: restaurantIds } });

    res.status(200).json({
      success: true,
      data: {
        restaurants,
        menuItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerOrders = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.user._id });
    const restaurantIds = restaurants.map((r) => r._id);

    const orders = await Order.find({ restaurantId: { $in: restaurantIds } })
      .populate("customerId", "fullName mobileNumber email avatar")
      .populate("restaurantId", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOwnerOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      const error = new Error("Status is required");
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleStoreStatus = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      const error = new Error("No restaurant found for this owner");
      error.statusCode = 404;
      return next(error);
    }
    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();
    res.status(200).json({
      success: true,
      message: `Store is now ${restaurant.isOpen ? "OPEN" : "CLOSED"}`,
      isOpen: restaurant.isOpen,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStoreTiming = async (req, res, next) => {
  try {
    const { openTime, closeTime } = req.body;
    const restaurant = await Restaurant.findOneAndUpdate(
      { ownerId: req.user._id },
      { openTime, closeTime },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Store timings updated",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const requestOwnerPayout = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant || restaurant.walletBalance < amount) {
      const error = new Error("Insufficient wallet balance for payout request");
      error.statusCode = 400;
      return next(error);
    }
    restaurant.walletBalance -= amount;
    await restaurant.save();
    res.status(200).json({
      success: true,
      message: `Payout request for ₹${amount} submitted successfully! Funds will be transferred within 24 hours.`,
      walletBalance: restaurant.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};


