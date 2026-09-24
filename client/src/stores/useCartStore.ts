import { create } from "zustand";
import toast from "react-hot-toast";

export interface CartItem {
  _id: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  isVeg?: boolean;
  image?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
}

interface CartState {
  items: CartItem[];
  restaurant: any | null;
  coupon: Coupon | null;
  specialInstructions: string;
  setSpecialInstructions: (note: string) => void;
  addItem: (item: CartItem, restaurantInfo: any) => void;
  updateQuantity: (menuItemId: string, newQuantity: number) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  applyCoupon: (couponObj: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getCartTotals: () => {
    itemTotal: number;
    deliveryFee: number;
    packagingFee: number;
    gst: number;
    discount: number;
    discountAmount: number;
    totalAmount: number;
    finalTotal: number;
    totalItems: number;
  };
}

const getSavedCart = () => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("cravings-cart");
      return saved
        ? JSON.parse(saved)
        : { items: [], restaurant: null, coupon: null };
    } catch (error) {
      console.error(error);
      return { items: [], restaurant: null, coupon: null };
    }
  }
  return { items: [], restaurant: null, coupon: null };
};

const saveCartToStorage = (cart: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cravings-cart", JSON.stringify(cart));
    } catch (error) {}
  }
};

const useCartStore = create<CartState>((set, get) => ({
  items: getSavedCart().items || [],
  restaurant: getSavedCart().restaurant || null,
  coupon: getSavedCart().coupon || null,
  specialInstructions: "",

  setSpecialInstructions: (note) => set({ specialInstructions: note }),

  addItem: (item, restaurantInfo) => {
    const currentRestaurant = get().restaurant;
    const currentItems = get().items;

    if (currentRestaurant && currentRestaurant._id !== restaurantInfo._id) {
      if (
        typeof window !== "undefined" &&
        !window.confirm(
          "Replace items in cart? Your cart contains dishes from another restaurant."
        )
      ) {
        return;
      }
      const newItems = [{ ...item, quantity: 1, menuItemId: item._id }];
      set({ items: newItems, restaurant: restaurantInfo, coupon: null });
      saveCartToStorage({
        items: newItems,
        restaurant: restaurantInfo,
        coupon: null,
      });
      toast.success(`${item.name} added to cart!`);
      return;
    }

    const existingIndex = currentItems.findIndex(
      (i) => i.menuItemId === item._id || i._id === item._id
    );
    let newItems;
    if (existingIndex > -1) {
      newItems = currentItems.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [
        ...currentItems,
        { ...item, quantity: 1, menuItemId: item._id },
      ];
    }

    set({ items: newItems, restaurant: restaurantInfo });
    saveCartToStorage({
      items: newItems,
      restaurant: restaurantInfo,
      coupon: get().coupon,
    });
    toast.success(`${item.name} added to cart!`);
  },

  updateQuantity: (menuItemId, newQuantity) => {
    const currentItems = get().items;
    const item = currentItems.find(
      (i) => i.menuItemId === menuItemId || i._id === menuItemId
    );
    if (!item) return;

    let newItems;
    if (newQuantity <= 0) {
      newItems = currentItems.filter(
        (i) => i.menuItemId !== menuItemId && i._id !== menuItemId
      );
      toast.success("Item removed from cart");
    } else {
      newItems = currentItems.map((i) =>
        i.menuItemId === menuItemId || i._id === menuItemId
          ? { ...i, quantity: newQuantity }
          : i
      );
    }

    const newRestaurant = newItems.length === 0 ? null : get().restaurant;
    set({ items: newItems, restaurant: newRestaurant });
    saveCartToStorage({
      items: newItems,
      restaurant: newRestaurant,
      coupon: get().coupon,
    });
  },

  incrementItem: (menuItemId) => {
    const currentItems = get().items;
    const item = currentItems.find(
      (i) => i.menuItemId === menuItemId || i._id === menuItemId
    );
    if (!item) return;
    get().updateQuantity(menuItemId, item.quantity + 1);
  },

  decrementItem: (menuItemId) => {
    const currentItems = get().items;
    const item = currentItems.find(
      (i) => i.menuItemId === menuItemId || i._id === menuItemId
    );
    if (!item) return;
    get().updateQuantity(menuItemId, item.quantity - 1);
  },

  removeItem: (menuItemId) => {
    const newItems = get().items.filter(
      (i) => i.menuItemId !== menuItemId && i._id !== menuItemId
    );
    const newRestaurant = newItems.length === 0 ? null : get().restaurant;
    set({ items: newItems, restaurant: newRestaurant });
    saveCartToStorage({
      items: newItems,
      restaurant: newRestaurant,
      coupon: get().coupon,
    });
    toast.success("Item removed from cart");
  },

  applyCoupon: (couponObj) => {
    set({ coupon: couponObj });
    saveCartToStorage({
      items: get().items,
      restaurant: get().restaurant,
      coupon: couponObj,
    });
    toast.success("Coupon applied successfully!");
  },

  removeCoupon: () => {
    set({ coupon: null });
    saveCartToStorage({
      items: get().items,
      restaurant: get().restaurant,
      coupon: null,
    });
    toast.success("Coupon removed");
  },

  clearCart: () => {
    set({ items: [], restaurant: null, coupon: null, specialInstructions: "" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("cravings-cart");
    }
  },

  getCartTotals: () => {
    const items = get().items;
    const coupon = get().coupon;

    const itemTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = items.length === 0 ? 0 : itemTotal > 499 ? 0 : 40;
    const packagingFee = items.length === 0 ? 0 : 20;
    const gst = Math.round(itemTotal * 0.05);

    let discount = 0;
    if (coupon && itemTotal >= (coupon.minOrderAmount || 0)) {
      discount = Math.min(
        Math.round((itemTotal * coupon.discountPercentage) / 100),
        coupon.maxDiscountAmount || 100
      );
    }

    const totalAmount = Math.max(
      0,
      itemTotal + deliveryFee + packagingFee + gst - discount
    );

    return {
      itemTotal,
      deliveryFee,
      packagingFee,
      gst,
      discount,
      discountAmount: discount,
      totalAmount,
      finalTotal: totalAmount,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  },
}));

export default useCartStore;
