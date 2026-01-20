import React, { useState } from "react";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "Arpit Gupta",
    email: "arpit@email.com",
    phone: "+91 98765 43210",
    address: "New Delhi, India",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161E54]">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center text-center">
          <div className="md:w-28 w-14 md:h-28 h-14 rounded-full bg-[#161E54] text-white flex items-center justify-center md:text-4xl text-2xl font-semibold">
            AG
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {formData.name}
          </h2>

          <p className="text-gray-500 text-sm">
            {formData.email}
          </p>

          <button className="mt-4 text-sm text-[#F16D34] hover:underline">
            Change Photo
          </button>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-[#161E54] mb-6">
            Personal Details
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#161E54] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#161E54] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#161E54] outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <button
                type="button"
                className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#161E54] text-white hover:bg-[#0F163F]"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
