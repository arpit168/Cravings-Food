import React from "react";
import Lottie from "lottie-react";
import Err from "../assets/animation/err404.json";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`z-99 absolute top-0 left-0 bg-white/80  w-full h-dvh flex justify-center items-center overflow-hidden`}
       
      >
        <Lottie animationData={Err} loop className="w-full" />
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500  text-white  px-6 py-2 rounded-lg hover:bg-blue-600 absolute z-100  left-[10%]"
      >
        Home
      </button>
    </>
  );
}

export default Error;