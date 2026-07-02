import express from "express";
import { getPlatformStats, getAllUsers, toggleRestaurantFeatured } from "../controllers/adminController.js";
import { Protect, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", Protect, AuthorizeRoles("admin"), getPlatformStats);
router.get("/users", Protect, AuthorizeRoles("admin"), getAllUsers);
router.put("/restaurant/:id/feature", Protect, AuthorizeRoles("admin"), toggleRestaurantFeatured);

export default router;
