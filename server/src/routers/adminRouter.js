import express from "express";
import {
  getPlatformStats,
  getAllUsers,
  toggleRestaurantFeatured,
  updateUserStatus,
  updateRestaurantStatus,
} from "../controllers/adminController.js";
import { Protect, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", Protect, AuthorizeRoles("admin"), getPlatformStats);
router.get("/users", Protect, AuthorizeRoles("admin"), getAllUsers);
router.put("/users/:id/status", Protect, AuthorizeRoles("admin"), updateUserStatus);
router.put("/restaurant/:id/feature", Protect, AuthorizeRoles("admin"), toggleRestaurantFeatured);
router.put("/restaurant/:id/status", Protect, AuthorizeRoles("admin"), updateRestaurantStatus);

export default router;
