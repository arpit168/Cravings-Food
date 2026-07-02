import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { Protect, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", Protect, createOrder);
router.get("/my-orders", Protect, getCustomerOrders);
router.get("/:id", Protect, getOrderById);
router.put("/:id/status", Protect, AuthorizeRoles("restaurant_owner", "delivery_partner", "admin"), updateOrderStatus);

export default router;
