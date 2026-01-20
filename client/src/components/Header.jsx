import React from "react";
import tranparentLogo from "../assets/transparentLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import useUiStore from "../stores/useUiStore";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { HiOutlineUserCircle } from "react-icons/hi";


const Header = () => {
  const {user,isLogin} = useAuth();
  const navigate = useNavigate();

  const { showHeader, setShowHeader } = useUiStore();

  return (
    <>
      <div className="bg-(--color-primary) px-8 py-4 flex justify-between items-center sticky top-0 z-99">
        <Link to="/">
          <img
            src={tranparentLogo}
            alt="logo"
            className="h-12 w-20 object-cover invert-100"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-4">
          <Link to="/" className="text-white hover:text-(--color-accent)">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-(--color-accent)">
            About
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-(--color-accent)"
          >
            Contact
          </Link>
        </div>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex gap-3">
         {isLogin? <span className="text-white font-bold text-3xl hover:text-indigo-700 hover:scale-105 duration-300  "><Link to={"/userDashboard"}><HiOutlineUserCircle/></Link></span>:(<> <button
         
            onClick={() => navigate("/login")}
            className="bg-blue-800 py-2 px-4 text-white font-bold rounded"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-800 py-2 px-4 text-white font-bold rounded"
          >
            Register
          </button></>)}
        </div>

        {/* MOBILE TOGGLE */}
        <motion.button
          whileTap={{ scale: 1 }}
          className="md:hidden text-white "
          onClick={(e) => {
            setShowHeader(!showHeader);
          }}
        >
          {showHeader ? <RxCross2 size={30} /> : <GiHamburgerMenu size={30} />}
        </motion.button>
      </div>

      {/* MOBILE MENU */}
      {showHeader && (
        <div className="bg-blue-950 ">
          <div className="md:hidden absolute z-99 w-full text-white bg-blue-950   flex flex-col gap-4 p-6 ">
            <Link
              to="/"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeader(!showHeader);
              }}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeader(!showHeader);
              }}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeader(!showHeader);
              }}
            >
              Contact
            </Link>
             {isLogin?"":(<> <Link
              to="/login"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeader(!showHeader);
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeader(!showHeader);
              }}
            >
              Register
            </Link></>)}
            
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
