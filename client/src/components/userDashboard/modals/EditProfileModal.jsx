import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/Api";
import toast from "react-hot-toast";
import { X, Check } from "lucide-react";

const EditProfileModal = ({ onClose }) => {
  const { user, setUser, setIsLogin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put("/user/update", formData);
      if (res.data && res.data.data) {
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setIsLogin(true);
        toast.success("Profile updated successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-surface w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-black text-text-primary">Edit Account Credentials</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-muted text-text-secondary hover:text-danger hover:bg-danger/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-text-muted">Full Name</label>
            <input
              type="text"
              required
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-text-muted">Email Address (Locked)</label>
            <input
              type="email"
              disabled
              name="email"
              value={formData.email}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-muted border border-border text-sm text-text-muted opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-text-muted">Mobile Number</label>
            <input
              type="text"
              required
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:border-primary transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-muted font-bold text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover font-black text-xs uppercase tracking-wider text-white shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"} <Check size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;