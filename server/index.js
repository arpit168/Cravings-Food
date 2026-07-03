import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/db.js";

// Routers
import AuthRouter from "./src/routers/authRouter.js";
import publicRouter from "./src/routers/publicRouter.js";
import userRouter from "./src/routers/userRouter.js";
import restaurantRouter from "./src/routers/restaurantRouter.js";
import orderRouter from "./src/routers/orderRouter.js";
import couponRouter from "./src/routers/couponRouter.js";
import adminRouter from "./src/routers/adminRouter.js";
import partnerRouter from "./src/routers/partnerRouter.js";

const app = express();

// Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Rate Limiter against DDoS / Brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
});
app.use("/api/", limiter);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cravings-food-by-arpit.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// API Routes
app.use("/auth", AuthRouter);
app.use("/api/auth", AuthRouter); // Alias for clean API naming
app.use("/public", publicRouter);
app.use("/api/public", publicRouter);
app.use("/user", userRouter);
app.use("/api/user", userRouter);

// New Core Domain Routes
app.use("/restaurants", restaurantRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/orders", orderRouter);
app.use("/api/orders", orderRouter);
app.use("/coupons", couponRouter);
app.use("/api/coupons", couponRouter);
app.use("/admin", adminRouter);
app.use("/api/admin", adminRouter);
app.use("/partner", partnerRouter);
app.use("/api/partner", partnerRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Cravings Production API Engine v2.0",
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;
  
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${StatusCode}: ${ErrorMessage}`);
  }

  res.status(StatusCode).json({
    success: false,
    message: ErrorMessage,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("==========================================");
  console.log(`🍔 Cravings Server running on port: ${port}`);
  console.log("==========================================");
  connectDB();
});
