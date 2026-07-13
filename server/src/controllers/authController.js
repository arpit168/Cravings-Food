import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { genToken } from "../utils/authToken.js";

export const UserRegister = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, role } = req.body;

    if (!fullName || !email || !mobileNumber || !password) {
      const error = new Error("All required fields must be provided.");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      const error = new Error("An account with this email already exists.");
      error.statusCode = 409;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const validRoles = ["customer", "restaurant_owner", "delivery_partner", "admin"];
    const userRole = validRoles.includes(role) ? role : "customer";

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: mobileNumber.trim(),
      password: hashPassword,
      role: userRole,
    });

    const token = genToken(newUser, res);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Registration successful! Welcome to Cravings.",
      data: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!existingUser) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      return next(error);
    }

    if (existingUser.isBlocked) {
      const error = new Error("Your account has been suspended by an Administrator. Contact support@cravings.com.");
      error.statusCode = 403;
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      return next(error);
    }

    const token = genToken(existingUser, res);

    const userResponse = existingUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful!",
      data: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const VerifyOtp = async (req, res, next) => {
  try {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber || !otp) {
      const error = new Error("Mobile number and OTP are required.");
      error.statusCode = 400;
      return next(error);
    }

    // In demo/test mode, any 4-digit code like 1234 or matching 8888 succeeds
    if (otp !== "1234" && otp !== "8888") {
      const error = new Error("Invalid OTP code provided.");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ mobileNumber: mobileNumber.trim() });
    if (!existingUser) {
      const error = new Error("No account registered with this mobile number.");
      error.statusCode = 404;
      return next(error);
    }

    if (existingUser.isBlocked) {
      const error = new Error("Your account has been suspended.");
      error.statusCode = 403;
      return next(error);
    }

    const token = genToken(existingUser, res);
    const userResponse = existingUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "OTP Verification successful!",
      data: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const UserLogout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("parleG", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

export const GetMe = async (req, res, next) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    next(error);
  }
};

