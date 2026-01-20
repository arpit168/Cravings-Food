import React from "react";

const UserTransaction = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#161E54]">
          Transactions
        </h1>
        <p className="text-gray-500 mt-1">
          View your payment history and wallet activity
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500">Total Spent</h3>
          <p className="text-3xl font-semibold text-[#161E54] mt-2">
            ₹24,560
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500">Total Received</h3>
          <p className="text-3xl font-semibold text-green-600 mt-2">
            ₹3,200
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500">Pending Payments</h3>
          <p className="text-3xl font-semibold text-[#F16D34] mt-2">
            ₹850
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-sm text-gray-500">Wallet Balance</h3>
          <p className="text-3xl font-semibold text-[#161E54] mt-2">
            ₹1,200
          </p>
        </div>

      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">

            <tr className="border-t">
              <td className="px-6 py-4">TXN-90871</td>
              <td className="px-6 py-4">15 Jan 2026</td>
              <td className="px-6 py-4">Order #2451</td>
              <td className="px-6 py-4 text-red-600">- ₹1,250</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                  Successful
                </span>
              </td>
            </tr>

            <tr className="border-t">
              <td className="px-6 py-4">TXN-90865</td>
              <td className="px-6 py-4">12 Jan 2026</td>
              <td className="px-6 py-4">Wallet Top-up</td>
              <td className="px-6 py-4 text-green-600">+ ₹1,500</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                  Successful
                </span>
              </td>
            </tr>

            <tr className="border-t">
              <td className="px-6 py-4">TXN-90840</td>
              <td className="px-6 py-4">10 Jan 2026</td>
              <td className="px-6 py-4">Order #2398</td>
              <td className="px-6 py-4 text-orange-600">- ₹499</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-[#F16D34]">
                  Pending
                </span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserTransaction;
