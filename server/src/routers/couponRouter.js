import express from "express";
import { getActiveCoupons, validateCoupon } from "../controllers/couponController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getActiveCoupons);
router.post("/validate", Protect, validateCoupon);

export default router;
