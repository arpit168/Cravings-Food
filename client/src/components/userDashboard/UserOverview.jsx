import React from "react";

const UserOverview = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500">
          Welcome back! Here’s a quick summary of your activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <OverviewCard title="Total Orders" value="128" />
        <OverviewCard title="Pending Orders" value="6" />
        <OverviewCard title="Total Spent" value="₹12,450" />
        <OverviewCard title="Active Tickets" value="2" />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-slate-800 mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between">
              <span>Order #124 placed</span>
              <span className="text-slate-400">2 hrs ago</span>
            </li>
            <li className="flex justify-between">
              <span>Payment successful</span>
              <span className="text-slate-400">Yesterday</span>
            </li>
            <li className="flex justify-between">
              <span>Support ticket created</span>
              <span className="text-slate-400">2 days ago</span>
            </li>
          </ul>
        </div>

        {/* Profile Snapshot */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-slate-800 mb-4">
            Profile Snapshot
          </h2>

          <div className="space-y-3 text-sm">
            <InfoRow label="Name" value="Arpit Gupta" />
            <InfoRow label="Email" value="arpit@email.com" />
            <InfoRow label="Status" value="Active" accent />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Small reusable components */

const OverviewCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-semibold text-slate-800 mt-2">{value}</p>
  </div>
);

const InfoRow = ({ label, value, accent }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span
      className={`font-medium ${
        accent ? "text-emerald-600" : "text-slate-700"
      }`}
    >
      {value}
    </span>
  </div>
);

export default UserOverview;
