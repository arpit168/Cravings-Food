import React from "react";
import { LayoutDashboard, User, ShoppingBag, CreditCard, LifeBuoy } from "lucide-react";

const UserBottombar = ({ active, setActive }) => {
  const menuItems = [
    { key: "overview", title: "Overview", icon: LayoutDashboard },
    { key: "profile", title: "Profile", icon: User },
    { key: "orders", title: "Orders", icon: ShoppingBag },
    { key: "transactions", title: "Wallet", icon: CreditCard },
    { key: "helpdesk", title: "Support", icon: LifeBuoy },
  ];

  return (
    <div className="flex items-center justify-around py-3 px-2 bg-surface border-b border-border">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isSelected = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition cursor-pointer ${
              isSelected ? "bg-primary text-white shadow-md" : "text-text-secondary hover:text-primary"
            }`}
          >
            <Icon size={18} />
            <span className="text-[10px] font-black uppercase tracking-wider">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default UserBottombar;
