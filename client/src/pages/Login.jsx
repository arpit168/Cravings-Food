import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../config/Api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TbRuler2Off } from "react-icons/tb";

const Login = () => {
  const { setUser, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validateError, setValidateError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleClearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
  };
  const validate = () => {
    let Error = {};

    // email
    if (
      !/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(
        formData.email,
      )
    ) {
      Error.email = "Use Proper Email Format!";
    }
    setValidateError(Error);
    return Object.keys(Error).length > 0 ? false : true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validate()) {
      setIsLoading(false);
      toast.error(" Some Field missing ");
      return;
    }
    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message);
      setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      handleClearForm();
      navigate("/userDashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <div className="">
          <div className=" py-20  bg-linear-to-br from-cyan-50 to-indigo-500 ">
            <div className="text-center space-y-2 ">
              <h1 className=" text-4xl font-bold text-gray-800"> Login</h1>
              <p className="text-zinc-700 font-semibold">
                Welcome back! Please Login and find your taste.
              </p>
            </div>
            <div className="">
              <div className=" flex  justify-center items-center my-5 ">
                <form onReset={handleClearForm} onSubmit={handleSubmit}>
                  <div className="bg-white  md:w-xl sm:w-auto   p-10  rounded-xl">
                    <div className="grid  space-y-4">
                      <div className="grid">
                        <label htmlFor="email">Email:</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="Enter Email Address"
                          className="w-full h-fit px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition disabled:cursor-not-allowed disabled:bg-gray-200"
                        />
                        {validateError.email && (
                          <span className="text-xs text-red-500 float-end">
                            {validateError.email}
                          </span>
                        )}
                      </div>
                      <div className="grid">
                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          name="password"
                          minLength="5"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="Enter a Password "
                          className="w-full h-fit px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition disabled:cursor-not-allowed disabled:bg-gray-200"
                        />
                        {validateError.password && (
                          <span className="text-xs text-red-500 float-end">
                            {validateError.password}
                          </span>
                        )}
                      </div>
                      <span className="flex justify-between">
                        <span className="flex space-x-2">
                          <input type="checkbox" />
                          <p>Remember me</p>
                        </span>
                        <p className="text-blue-700 hover:text-blue-900 ">
                          <Link to={"/"}>Forgot Password!</Link>
                        </p>
                      </span>
                    </div>
                    <div className="flex space-x-5 mt-5 justify-center">
                      <button
                        disabled={isLoading}
                        type="reset"
                        className="flex-1 bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg hover:bg-gray-400 transition duration-300 transform hover:scale-100  disabled:cursor-not-allowed disabled:scale-100 disabled:bg-gray-300 cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:scale-100 disabled:bg-gray-300"
                      >
                        {isLoading ? "Login..." : "Login"}
                      </button>
                    </div>
                    <div className="flex space-x-1 justify-center mt-3">
                      <p>Don't have an account. </p>
                      <Link to={"/register"}>
                        <p className="hover:text-blue-700 text-blue-400 ">
                          Register Now!
                        </p>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
