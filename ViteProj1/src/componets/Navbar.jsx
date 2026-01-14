import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(() => {
    const roleSeved = localStorage.getItem("role");
    return roleSeved || "";
  })

  const [name, setName] = useState(() => {
    const saved = localStorage.getItem("name");
    return saved || "";
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("name");
      setName("");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 shadow-md bg-white">

  {/* Logo */}
  <NavLink
    to="/"
    className="text-2xl font-extrabold tracking-wide text-blue-600 hover:text-blue-700 transition"
  >
    Shop<span className="text-gray-900">Cart</span>
  </NavLink>

  {/* Menu */}
  <ul className="hidden md:flex items-center gap-6 font-medium text-gray-600">
    <NavLink to="/" className="hover:text-blue-600">
      <li>Home</li>
    </NavLink>
    <li className="cursor-pointer hover:text-blue-600">Menu</li>
    <li className="cursor-pointer hover:text-blue-600">Contact Us</li>
  </ul>

  {/* Right Section */}
  <div className="flex items-center gap-4">

    {/* User Name */}
    {name && (
      <div className="text-sm text-gray-600">
        Welcome, <span className="font-semibold text-blue-600">{name}</span>
      </div>
    )}

    {/* Auth Buttons */}
    {!name && (
      <>
        <NavLink to="/login">
          <button className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
            Login
          </button>
        </NavLink>

        <NavLink to="/register">
          <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
            Register
          </button>
        </NavLink>
      </>
    )}

    {/* Logged In */}
    {name && (
      <>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>

        {role === "user" ? (
          <NavLink to="/regularUser">
            <button className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition">
              Shop
            </button>
          </NavLink>
        ) : (
          <NavLink to="/admin">
            <button className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition">
              Admin
            </button>
          </NavLink>
        )}
      </>
    )}
  </div>
</nav>

  );
};

export default Navbar;
