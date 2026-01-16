import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(() => {
    const roleSeved = localStorage.getItem("role");
    return roleSeved || "";
  });

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
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold tracking-wide text-indigo-600"
        >
          Shop<span className="text-gray-900">Cart</span>
        </NavLink>

        {/* Center Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <NavLink to="/" className="hover:text-indigo-600 transition">
            Home
          </NavLink>
          <li className="cursor-pointer hover:text-indigo-600 transition">
            Menu
          </li>
          <li className="cursor-pointer hover:text-indigo-600 transition">
            Contact
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Welcome */}
          {name && (
            <span className="hidden md:block text-sm text-gray-500">
              Hi, <span className="font-semibold text-indigo-600">{name}</span>
            </span>
          )}

          {/* Auth Buttons */}
          {!name && (
            <>
              <NavLink to="/login">
                <button className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition">
                  Login
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
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
                className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>

              {role === "user" ? (
                <>
                  <NavLink to="/regularUser">
                    <button className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition">
                      Shop
                    </button>
                  </NavLink>

                  <NavLink to="/Profile">
                    <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                      Profile
                    </button>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/admin">
                    <button className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition">
                      Admin
                    </button>
                  </NavLink>

                  <NavLink to="/Profile">
                    <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                      Profile
                    </button>
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
