import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";

import User from "../models/userModel.js";
import Restaurant from "../models/restaurantModel.js";
import MenuItem from "../models/menuItemModel.js";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
import Review from "../models/reviewModel.js";

const importData = async () => {
  try {
    await connectDB();
    console.log("🔥 Clearing old database data...");

    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("Cravings123", salt);

    console.log("👤 Creating demo users across all 4 roles...");
    const createdUsers = await User.insertMany([
      {
        fullName: "Arpit Gupta (Admin)",
        email: "admin@cravings.com",
        mobileNumber: "9876543210",
        password: hashPassword,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        walletBalance: 5000,
      },
      {
        fullName: "Chef Vikram Khanna",
        email: "owner@cravings.com",
        mobileNumber: "9876543211",
        password: hashPassword,
        role: "restaurant_owner",
        avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80",
        walletBalance: 2500,
      },
      {
        fullName: "Rahul Delivery Express",
        email: "partner@cravings.com",
        mobileNumber: "9876543212",
        password: hashPassword,
        role: "delivery_partner",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=80",
        isOnline: true,
        walletBalance: 1200,
      },
      {
        fullName: "Rohan Sharma (Foodie)",
        email: "customer@cravings.com",
        mobileNumber: "9876543213",
        password: hashPassword,
        role: "customer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        walletBalance: 1500,
        loyaltyPoints: 320,
        addresses: [
          {
            label: "Home",
            street: "Flat 402, Sunshine Towers, Linking Road",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400050",
            isDefault: true,
          },
          {
            label: "Work",
            street: "TechPark Phase 2, BKC",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400051",
            isDefault: false,
          },
        ],
      },
    ]);

    const owner = createdUsers[1];
    const customer = createdUsers[3];
    const partner = createdUsers[2];

    console.log("🍽️ Creating curated startup-grade restaurants...");
    const restaurants = await Restaurant.insertMany([
      {
        name: "Truffles Gourmet & Burgers",
        ownerId: owner._id,
        cuisines: ["American", "Burgers", "Fast Food", "Beverages"],
        rating: 4.8,
        totalReviews: 450,
        deliveryTime: "20-25 min",
        costForTwo: 600,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
        bannerImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80",
        address: { street: "Hill Road, Bandra West", city: "Mumbai", state: "Maharashtra" },
        isPureVeg: false,
        isFeatured: true,
        offers: ["Flat ₹100 OFF above ₹499", "Free Delivery on Bestsellers"],
      },
      {
        name: "Meghana Foods Authentic Biryani",
        ownerId: owner._id,
        cuisines: ["Biryani", "Andhra", "North Indian"],
        rating: 4.7,
        totalReviews: 890,
        deliveryTime: "25-30 min",
        costForTwo: 500,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
        bannerImage: "https://images.unsplash.com/photo-1633940275881-22448408cf5e?w=1200&auto=format&fit=crop&q=80",
        address: { street: "Veera Desai Road, Andheri West", city: "Mumbai", state: "Maharashtra" },
        isPureVeg: false,
        isFeatured: true,
        offers: ["20% OFF up to ₹120", "Buy 1 Get 1 on Kebab Platter"],
      },
      {
        name: "La Pizzeria Napoletana",
        ownerId: owner._id,
        cuisines: ["Italian", "Pizza", "Pasta", "Desserts"],
        rating: 4.6,
        totalReviews: 310,
        deliveryTime: "30-35 min",
        costForTwo: 800,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        bannerImage: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1200&auto=format&fit=crop&q=80",
        address: { street: "Phoenix Palladium, Lower Parel", city: "Mumbai", state: "Maharashtra" },
        isPureVeg: false,
        isFeatured: true,
        offers: ["Free Garlic Bread on orders above ₹699"],
      },
      {
        name: "Saravana Bhavan Heritage",
        ownerId: owner._id,
        cuisines: ["South Indian", "Pure Veg", "Filter Coffee"],
        rating: 4.5,
        totalReviews: 620,
        deliveryTime: "15-20 min",
        costForTwo: 300,
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80",
        bannerImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80",
        address: { street: "Matunga East Circle", city: "Mumbai", state: "Maharashtra" },
        isPureVeg: true,
        isFeatured: false,
        offers: ["15% OFF on Breakfast Combos"],
      },
      {
        name: "Mainland China & Wok",
        ownerId: owner._id,
        cuisines: ["Chinese", "Asian", "Momos", "Noodles"],
        rating: 4.4,
        totalReviews: 280,
        deliveryTime: "35-40 min",
        costForTwo: 700,
        image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80",
        bannerImage: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1200&auto=format&fit=crop&q=80",
        address: { street: "Hiranandani Gardens, Powai", city: "Mumbai", state: "Maharashtra" },
        isPureVeg: false,
        isFeatured: false,
        offers: ["Flat 15% OFF on Dimsums"],
      },
      {
        name: "Belgium Waffle & Gelato Bar",
        ownerId: owner._id,
        cuisines: ["Desserts", "Waffles", "Ice Cream", "Shakes"],
        rating: 4.9,
        totalReviews: 780,
        deliveryTime: "15-20 min",
        costForTwo: 350,
        image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80",
        bannerImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&auto=format&fit=crop&q=80",
        address: { street: "Juhu Tara Road", city: "Mumbai", state: "Maharashtra" },
        isPureVeg: true,
        isFeatured: true,
        offers: ["Flat ₹50 OFF on orders above ₹249"],
      },
    ]);

    console.log("🍟 Creating menu items for all restaurants...");
    await MenuItem.insertMany([
      // Truffles Burgers
      {
        restaurantId: restaurants[0]._id,
        name: "Ultimate Truffle Cheeseburger",
        description: "Double juicy patty with caramelized onions, aged cheddar, and house truffle aioli on a toasted brioche bun.",
        price: 349,
        category: "Recommended",
        isVeg: false,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[0]._id,
        name: "Crispy Peri Peri Chicken Burger",
        description: "Crunchy fried chicken thigh coated in spicy African peri-peri glaze with jalapenos and coleslaw.",
        price: 289,
        category: "Burgers",
        isVeg: false,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[0]._id,
        name: "Smoked Cottage Cheese Patty Burger",
        description: "Grilled paneer patty marinated in smoky BBQ herbs with crisp lettuce and chipotle mayo.",
        price: 259,
        category: "Burgers",
        isVeg: true,
        isBestseller: false,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[0]._id,
        name: "Loaded Cheesy Bacon Fries",
        description: "Golden shoestring fries smothered in melted cheddar cheese sauce and crispy bacon crumbles.",
        price: 199,
        category: "Starters",
        isVeg: false,
        isBestseller: false,
        image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
      },
      // Meghana Foods Biryani
      {
        restaurantId: restaurants[1]._id,
        name: "Meghana Special Chicken Boneless Biryani",
        description: "Fragrant long-grain basmati rice layered with spicy boneless chicken kebabs cooked in rich aromatic spices.",
        price: 380,
        category: "Recommended",
        isVeg: false,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[1]._id,
        name: "Royal Mutton Dum Biryani",
        description: "Slow-cooked tender mutton marinated overnight in saffron spices and dum cooked with aromatic rice.",
        price: 450,
        category: "Biryani",
        isVeg: false,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1633940275881-22448408cf5e?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[1]._id,
        name: "Hyderabadi Paneer 65 Biryani",
        description: "Spiced paneer 65 chunks tossed in curry leaves served over flavorful dum biryani rice.",
        price: 310,
        category: "Biryani",
        isVeg: true,
        isBestseller: false,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      },
      // La Pizzeria
      {
        restaurantId: restaurants[2]._id,
        name: "Margherita Di Bufala Pizza",
        description: "Wood-fired crust topped with San Marzano tomato sauce, fresh creamy buffalo mozzarella, and basil leaves.",
        price: 420,
        category: "Recommended",
        isVeg: true,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[2]._id,
        name: "Pepperoni & Spicy Honey Pizza",
        description: "Crispy Italian pepperoni cups drizzled with hot chili-infused honey on authentic sourdough base.",
        price: 520,
        category: "Pizza",
        isVeg: false,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
      },
      // Saravana Bhavan
      {
        restaurantId: restaurants[3]._id,
        name: "Ghee Roast Masala Dosa",
        description: "Paper-thin golden dosa roasted in pure cow ghee stuffed with spiced potato masala, served with 3 chutneys & sambar.",
        price: 180,
        category: "Recommended",
        isVeg: true,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80",
      },
      {
        restaurantId: restaurants[3]._id,
        name: "Medu Vada Sambar Dip (4 Pcs)",
        description: "Crispy lentil fritters soaked in steaming hot spiced South Indian sambar with coconut chutney.",
        price: 130,
        category: "Starters",
        isVeg: true,
        isBestseller: false,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      },
      // Belgium Waffle
      {
        restaurantId: restaurants[5]._id,
        name: "Nutella Ferrero Rocher Waffle",
        description: "Crispy warm Belgian waffle pocket spread generously with imported Nutella and crushed Ferrero Rocher chocolates.",
        price: 210,
        category: "Recommended",
        isVeg: true,
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80",
      },
    ]);

    console.log("🏷️ Creating promotional coupons...");
    await Coupon.insertMany([
      {
        code: "WELCOME50",
        title: "50% OFF on your first order",
        description: "Get 50% discount up to ₹150 on your first Cravings order above ₹299.",
        discountPercentage: 50,
        maxDiscountAmount: 150,
        minOrderAmount: 299,
      },
      {
        code: "CRAVINGS100",
        title: "Flat ₹100 OFF",
        description: "Enjoy flat ₹100 discount on premium meals above ₹499.",
        discountPercentage: 25,
        maxDiscountAmount: 100,
        minOrderAmount: 499,
      },
      {
        code: "FESTIVE20",
        title: "20% OFF Unlimited",
        description: "Save 20% up to ₹80 on all restaurants today.",
        discountPercentage: 20,
        maxDiscountAmount: 80,
        minOrderAmount: 199,
      },
    ]);

    console.log("📦 Creating demo orders...");
    await Order.create({
      orderId: "CRV-893201",
      customerId: customer._id,
      restaurantId: restaurants[0]._id,
      deliveryPartnerId: partner._id,
      items: [
        {
          menuItemId: (await MenuItem.findOne({ name: "Ultimate Truffle Cheeseburger" }))._id,
          name: "Ultimate Truffle Cheeseburger",
          price: 349,
          quantity: 2,
          isVeg: false,
        },
      ],
      pricing: {
        itemTotal: 698,
        deliveryFee: 0,
        packagingFee: 20,
        gst: 35,
        discount: 100,
        totalAmount: 653,
      },
      deliveryAddress: customer.addresses[0],
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Out for Delivery",
      couponCode: "CRAVINGS100",
    });

    console.log("✅ Seeding completed successfully! All demo accounts ready.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

importData();
