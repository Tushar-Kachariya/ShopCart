import React, { useState } from "react";
import Navbar from "../componets/Navbar";
import { useNavigate, NavLink } from "react-router-dom";
import Footer from "../componets/Footer";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await api.post(
        "/user/login",
        data,
        { withCredentials: true }
      );

      localStorage.setItem("name", res.data.user.userName);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);

      

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/regularUser");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
            Login to <span className="text-blue-600">ShopCart</span>
          </h1>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
          >
            Login
          </button>

          <p className="text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <NavLink
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register
            </NavLink>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}
