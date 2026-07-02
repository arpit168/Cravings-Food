import React from "react";
import { LayoutDashboard, User, ShoppingBag, CreditCard, LifeBuoy } from "lucide-react";

const UserSideBar = ({ active, setActive }) => {
  const menuItems = [
    { key: "overview", title: "Overview", icon: LayoutDashboard },
    { key: "profile", title: "My Profile", icon: User },
    { key: "orders", title: "Food Orders", icon: ShoppingBag },
    { key: "transactions", title: "Wallet & Ledger", icon: CreditCard },
    { key: "helpdesk", title: "Help Desk", icon: LifeBuoy },
  ];

  return (
    <div className="p-6 space-y-8 h-full flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wider">
            User Portal
          </span>
          <h2 className="text-xl font-black text-text-primary mt-2">Gourmet Profile</h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-text-secondary hover:bg-muted hover:text-primary"
                }`}
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default UserSideBar;