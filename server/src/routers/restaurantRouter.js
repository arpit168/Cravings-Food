import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  addMenuItem,
  getOwnerRestaurants,
} from "../controllers/restaurantController.js";
import { Protect, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/owner/my-restaurants", Protect, AuthorizeRoles("restaurant_owner", "admin"), getOwnerRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", Protect, AuthorizeRoles("restaurant_owner", "admin"), createRestaurant);
router.post("/menu-item", Protect, AuthorizeRoles("restaurant_owner", "admin"), addMenuItem);

export default router;
