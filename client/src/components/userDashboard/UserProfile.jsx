import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "./modals/EditProfileModal";

const UserProfile = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#161E54]">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center text-center">
            <div className="md:w-28 w-14 md:h-28 h-14 rounded-full bg-[#161E54] text-white flex items-center justify-center  text-2xl font-semibold">
              AG
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {user.fullName}
            </h2>

            <p className="text-gray-500 text-sm">{user.email}</p>

            <input
              type="file"
              className="mt-4 text-sm text-[#F16D34] ms-20 hover:underline"
            />
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-[#161E54] mb-6">
              Personal Details
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-6 border-t pt-6">
                <div className="flex flex-col ">
                  <label className="text-sm font-semibold text-gray-600 mb-2 uppercase ">
                    Full Name
                  </label>
                  <span className="text-lg text-gray-800 font-medium border p-2 rounded">
                    {user.fullName}
                  </span>
                </div>

                <div className="flex flex-col ">
                  <label className="text-sm font-semibold text-gray-600 mb-2 uppercase ">
                    Email
                  </label>
                  <span className="text-lg text-gray-800 font-medium break-all border p-2 rounded">
                    {user.email}
                  </span>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <span className="text-lg text-gray-800 font-medium border p-2 rounded">
                    {user.mobileNumber}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="border px-4 py-2 bg-indigo-700  text-white hover:outline-red-400"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Edit Profile
              </button>
            </form>
          </div>
          {isEditProfileModalOpen && (
            <EditProfileModal
              onClose={() => setIsEditProfileModalOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
