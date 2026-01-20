import React, { useState } from "react";

const UserOrders = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161E54]">
          My Orders
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage your orders
        </p>
      </div>

      {/* Tabs */}
      <div className="flex md:flex-row flex-col gap-4 mb-8">
        {["all", "active", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium transition
              ${
                activeTab === tab
                  ? "bg-[#161E54] text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Orders
          </button>
        ))}
      </div>

      {/* Orders Section */}
      <div className="space-y-6">

        {/* Order Card */}
        {(activeTab === "all" || activeTab === "active") && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#161E54]">
                Order #2451
              </h3>
              <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-[#F16D34]">
                In Progress
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-gray-600">
              <p><span className="font-medium">Date:</span> 12 Jan 2026</p>
              <p><span className="font-medium">Items:</span> 3</p>
              <p><span className="font-medium">Total:</span> ₹1,250</p>
            </div>

            <button className="mt-4 text-sm text-[#F16D34] hover:underline">
              View Details
            </button>
          </div>
        )}

        {(activeTab === "all" || activeTab === "completed") && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#161E54]">
                Order #2398
              </h3>
              <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-600">
                Delivered
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-gray-600">
              <p><span className="font-medium">Date:</span> 03 Jan 2026</p>
              <p><span className="font-medium">Items:</span> 1</p>
              <p><span className="font-medium">Total:</span> ₹499</p>
            </div>

            <button className="mt-4 text-sm text-[#161E54] hover:underline">
              Download Invoice
            </button>
          </div>
        )}

        {activeTab === "active" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#161E54]">
                Order #2470
              </h3>
              <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-[#F16D34]">
                Shipped
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-gray-600">
              <p><span className="font-medium">Date:</span> 15 Jan 2026</p>
              <p><span className="font-medium">Items:</span> 2</p>
              <p><span className="font-medium">Total:</span> ₹899</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOrders;
