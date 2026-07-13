import jwt from "jsonwebtoken";

export const genToken = (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role || "customer",
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "fallback_secret_key_for_dev_only",
      {
        expiresIn: "7d",
      }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("parleG", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return token;
  } catch (error) {
    throw error;
  }
};
