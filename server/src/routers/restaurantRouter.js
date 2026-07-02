import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  addMenuItem,
  getOwnerRestaurants,
  getOwnerOrders,
  updateOwnerOrderStatus,
  toggleStoreStatus,
  updateStoreTiming,
  requestOwnerPayout,
  toggleMenuItemAvailability,
} from "../controllers/restaurantController.js";
import { Protect, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/owner/my-restaurants", Protect, AuthorizeRoles("restaurant_owner", "admin"), getOwnerRestaurants);
router.get("/owner/orders", Protect, AuthorizeRoles("restaurant_owner", "admin"), getOwnerOrders);
router.put("/owner/orders/:orderId/status", Protect, AuthorizeRoles("restaurant_owner", "admin"), updateOwnerOrderStatus);
router.put("/owner/toggle-status", Protect, AuthorizeRoles("restaurant_owner", "admin"), toggleStoreStatus);
router.put("/owner/timing", Protect, AuthorizeRoles("restaurant_owner", "admin"), updateStoreTiming);
router.post("/owner/payout", Protect, AuthorizeRoles("restaurant_owner", "admin"), requestOwnerPayout);
router.put("/owner/menu/:itemId/availability", Protect, AuthorizeRoles("restaurant_owner", "admin"), toggleMenuItemAvailability);

router.get("/:id", getRestaurantById);
router.post("/", Protect, AuthorizeRoles("restaurant_owner", "admin"), createRestaurant);
router.post("/menu", Protect, AuthorizeRoles("restaurant_owner", "admin"), addMenuItem);
router.post("/menu-item", Protect, AuthorizeRoles("restaurant_owner", "admin"), addMenuItem);

export default router;
