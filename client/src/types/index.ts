export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: "customer" | "restaurant_owner" | "delivery_partner" | "admin";
  avatar?: string;
  addresses: Address[];
  walletBalance: number;
  loyaltyPoints: number;
  isOnline: boolean;
  isApproved: boolean;
  isBlocked: boolean;
  kycStatus?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  drivingLicense?: string;
  aadharNumber?: string;
  createdAt: string;
  updatedAt: string;
}
