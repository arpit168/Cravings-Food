import User from "../models/userModel.js";

export const UserUpdate = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, avatar, addresses } = req.body;
    const currentUser = req.user;

    if (!fullName || !email || !mobileNumber) {
      const error = new Error("Full name, email, and mobile number are required.");
      error.statusCode = 400;
      return next(error);
    }

    const updateFields = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: mobileNumber.trim(),
    };

    if (avatar) updateFields.avatar = avatar;
    if (Array.isArray(addresses)) updateFields.addresses = addresses;

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const AddUserAddress = async (req, res, next) => {
  try {
    const { label, street, city, state, zip, isDefault } = req.body;
    if (!street || !city) {
      const error = new Error("Street and City are required fields.");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label: label || "Home",
      street,
      city,
      state: state || "Maharashtra",
      zip: zip || "400001",
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Address added successfully!",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Address deleted successfully!",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};