import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }
    setSubmitted(true);
    toast.success("Password reset link sent to your email!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background transition-colors duration-300">
      <div className="max-w-md w-full bg-surface p-8 rounded-3xl border border-border shadow-xl space-y-6">
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary mb-4 transition"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <h1 className="text-2xl font-black text-text-primary">Reset Password</h1>
          <p className="text-sm text-text-muted mt-1">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-success/10 border border-success/20 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <h3 className="font-bold text-base text-success">Check your inbox</h3>
            <p className="text-xs text-text-muted">
              We sent a recovery link to <strong className="text-text-primary">{email}</strong>. Please follow the instructions in the email.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                <input
                  type="email"
                  required
                  placeholder="customer@cravings.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-text-primary text-sm outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/25 transition cursor-pointer"
            >
              Send Recovery Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
