import React, { useState } from "react";
import Navbar from "../componets/Navbar";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import Footer from "../componets/Footer";

export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName) return alert("Username is required");
    if (formData.userName.length < 3)
      return alert("Username must be at least 3 characters");
    if (!formData.email) return alert("Email is required");
    if (!formData.password) return alert("Password is required");
    if (formData.password.length < 6)
      return alert("Password must be at least 6 characters");

    try {
      await axios.post(
        "http://localhost:5000/api/user/create",
        formData
      );

      alert("User registered successfully!");
      navigate("/login");
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
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg"
        >
          <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
            Create Your <span className="text-blue-600">Account</span>
          </h1>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
          >
            Register
          </button>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Login
            </NavLink>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}
