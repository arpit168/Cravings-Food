import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "./modals/EditProfileModal";
import { User, Mail, Phone, Edit3, ShieldCheck } from "lucide-react";

const UserProfile = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex justify-between items-center shadow-xs">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">My Profile & Preferences</h1>
          <p className="text-sm text-text-secondary">View and customize your personal contact credentials</p>
        </div>

        <button
          onClick={() => setIsEditProfileModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-surface rounded-3xl border border-border p-8 flex flex-col items-center text-center space-y-4 shadow-xs self-start">
          <div className="w-28 h-28 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-primary/25 border-4 border-surface">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-primary">{user?.fullName}</h2>
            <p className="text-xs font-semibold text-text-muted">{user?.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-text-secondary">
            <span>Account Role</span>
            <span className="px-2.5 py-1 rounded-md bg-muted text-primary uppercase font-black">{user?.role}</span>
          </div>
        </div>

        {/* Profile Form / Details */}
        <div className="lg:col-span-2 bg-surface rounded-3xl border border-border p-8 space-y-6 shadow-xs">
          <h2 className="text-lg font-black text-text-primary border-b border-border pb-4">Personal Information</h2>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-1.5">
                <User size={14} className="text-primary" /> Full Name
              </label>
              <div className="p-4 rounded-2xl bg-background border border-border text-text-primary font-bold text-base">
                {user?.fullName || "Not Specified"}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-1.5">
                <Mail size={14} className="text-primary" /> Email Address
              </label>
              <div className="p-4 rounded-2xl bg-background border border-border text-text-primary font-bold text-base break-all">
                {user?.email || "Not Specified"}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-text-muted flex items-center gap-1.5">
                <Phone size={14} className="text-primary" /> Mobile Number
              </label>
              <div className="p-4 rounded-2xl bg-background border border-border text-text-primary font-bold text-base">
                {user?.mobileNumber || "+91 9876543210"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditProfileModalOpen && (
        <EditProfileModal onClose={() => setIsEditProfileModalOpen(false)} />
      )}
    </div>
  );
};

export default UserProfile;
