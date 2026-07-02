import express from "express";
import {
  UserUpdate,
  AddUserAddress,
  DeleteUserAddress,
  ToggleWishlist,
  GetWishlist,
} from "../controllers/userController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/update", Protect, UserUpdate);
router.post("/address", Protect, AddUserAddress);
router.delete("/address/:addressId", Protect, DeleteUserAddress);
router.post("/wishlist", Protect, ToggleWishlist);
router.get("/wishlist", Protect, GetWishlist);

export default router;