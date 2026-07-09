import React from "react";
import Lottie from "lottie-react";
import Err from "../assets/animation/err404.json";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Error() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-6 text-center space-y-6 transition-colors duration-300">
      <div className="max-w-md w-full">
        <Lottie animationData={Err} loop className="w-full h-80 object-contain" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-text-primary">Page Not Found (404)</h1>
        <p className="text-sm text-text-muted max-w-sm mx-auto">
          The culinary destination you are looking for has either moved or doesn't exist.
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 transition cursor-pointer"
      >
        <ArrowLeft size={16} /> Return to Homepage
      </button>
    </div>
  );
}

export default Error;