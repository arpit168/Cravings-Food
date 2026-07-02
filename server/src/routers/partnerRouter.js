import express from "express";
import {
  getAvailableOrders,
  getPartnerDeliveries,
  acceptDeliveryOrder,
  updateDeliveryStatus,
  updatePartnerProfile,
  togglePartnerOnlineStatus,
  withdrawPartnerWallet,
} from "../controllers/partnerController.js";
import { Protect, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/available", Protect, AuthorizeRoles("delivery_partner", "admin"), getAvailableOrders);
router.get("/my-deliveries", Protect, AuthorizeRoles("delivery_partner", "admin"), getPartnerDeliveries);
router.put("/profile/kyc", Protect, AuthorizeRoles("delivery_partner", "admin"), updatePartnerProfile);
router.put("/toggle-online", Protect, AuthorizeRoles("delivery_partner", "admin"), togglePartnerOnlineStatus);
router.post("/withdraw", Protect, AuthorizeRoles("delivery_partner", "admin"), withdrawPartnerWallet);

router.put("/:id/accept", Protect, AuthorizeRoles("delivery_partner", "admin"), acceptDeliveryOrder);
router.put("/:id/status", Protect, AuthorizeRoles("delivery_partner", "admin"), updateDeliveryStatus);

export default router;
