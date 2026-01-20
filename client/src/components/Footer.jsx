import React from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Craving from "../assets/transparentlogo.png";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-(--color-primary) text-gray-300 z-50"
      data-aos="fade-up"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className=" ">
            <img
              src={Craving}
              alt=""
              className="h-12  w-20 object-cover invert-100"
            />
            <p className="text-sm w-40 ">
              Your one-stop destination for quality Meal at affordable prices.{" "}
              <br />
            </p>
            <p className="text-sm w-40 mt-1 ">
              Diet starts tomorrow. Craving made sure of it.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white ">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 hover:text-gray-">
              Support
            </h3>
            <ul className="space-y-2 text-sm ">
              <li>Taste Gurantee</li>
              <li>Time Actuallity</li>
              <li>Food Delivery</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Contact Us
            </h3>
            <p className="text-sm mt-2">📍 India</p>
            <p className="text-sm mt-2">📧 support@anokhaCraving.com</p>
            <p className="text-sm mt-2">📞 +91 95101**42</p>
            <div className="flex gap-3 text-2xl mt-2 ms-2 ">
              <FaFacebook className="hover:text-sky-700" />{" "}
              <FaInstagram className="hover:text-pink-900" />{" "}
              <FaTwitter className="hover:text-sky-700 " />{" "}
              <FaWhatsapp className="hover:text-green-500" />{" "}
            </div>
          </div>
        </div>

        <div className="border-t  border-gray-700 mt-10 pt-6 flex justify-between text-sm">
          <span>
            © {new Date().getFullYear()} Craving.com. All rights reserved.
          </span>
          <span className="flex items-center">
            Made with <FaHeart className="text-red-700 mx-1" /> by Anokha Arpit
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
