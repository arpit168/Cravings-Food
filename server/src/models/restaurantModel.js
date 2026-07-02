import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    cuisines: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.2,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 120,
    },
    deliveryTime: {
      type: String,
      default: "25-30 min",
    },
    costForTwo: {
      type: Number,
      default: 400,
    },
    image: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
    },
    address: {
      street: { type: String, default: "Linking Road, Bandra West" },
      city: { type: String, default: "Mumbai" },
      state: { type: String, default: "Maharashtra" },
    },
    isPureVeg: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    offers: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
