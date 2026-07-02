import express from "express";
import {
  UserRegister,
  UserLogin,
  UserLogout,
  GetMe,
} from "../controllers/authController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/logout", UserLogout);
router.get("/me", Protect, GetMe);

export default router;
