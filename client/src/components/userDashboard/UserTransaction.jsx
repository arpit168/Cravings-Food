import React, { useState, useEffect } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";

const UserTransaction = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((acc, curr) => acc + (curr.pricing?.totalAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex justify-between items-center shadow-xs">
        <div>
          <span className="px-3 py-1 rounded-full bg-success/10 text-success font-bold text-xs uppercase tracking-wider">
            Ledger & Wallet
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">Financial Transactions</h1>
          <p className="text-sm text-text-secondary">Track your payment invoices, wallet balance, and refund ledgers</p>
        </div>

        <button
          onClick={fetchTransactions}
          className="p-3 rounded-2xl bg-muted border border-border text-text-secondary hover:text-primary transition cursor-pointer"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-primary" : ""} />
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Total Food Spend</p>
          <p className="text-2xl font-black text-text-primary">₹{totalSpent}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Available Wallet Credits</p>
          <p className="text-2xl font-black text-success">₹{user?.walletBalance || 1200}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <ArrowUpRight size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Reward Cashbacks</p>
          <p className="text-2xl font-black text-text-primary">₹340 Earned</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-xs">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-black text-text-primary">Ledger History</h2>
        </div>

        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded-xl"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="font-bold text-text-primary">No financial transactions recorded</p>
            <p className="text-xs text-text-muted">Completed food orders will automatically appear in your ledger.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted border-b border-border text-text-primary uppercase font-bold">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-secondary font-medium">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-muted/50 transition">
                    <td className="p-4 font-bold text-text-primary">TXN-{ord.orderId || ord._id.slice(-6).toUpperCase()}</td>
                    <td className="p-4">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-text-primary">Order from {ord.restaurantId?.name || "Kitchen"}</td>
                    <td className="p-4 uppercase">{ord.paymentMethod}</td>
                    <td className="p-4 font-black text-danger">- ₹{ord.pricing?.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-success/10 text-success font-bold">
                        Successful
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTransaction;
