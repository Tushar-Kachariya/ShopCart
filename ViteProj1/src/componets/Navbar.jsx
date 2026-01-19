import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [auth, setAuth] = useState({
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
  });

  const handleLogout = async () => {
    try {
      await api.post(
        "/user/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("name");
      localStorage.removeItem("role");

      setAuth({ name: null, role: null });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setOpen(false);
  }, []);

  const linkClass = ({ isActive }) =>
    `hover:text-indigo-600 transition ${
      isActive ? "text-indigo-600 font-semibold" : "text-gray-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <NavLink to="/" className="text-2xl font-extrabold text-indigo-600">
          Shop<span className="text-gray-900">Cart</span>
        </NavLink>

        <ul className="hidden md:flex items-center gap-8 font-medium">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink  className={linkClass}>Menu</NavLink>
          <NavLink  className={linkClass}>Contact</NavLink>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {auth.name && (
            <span className="text-sm text-gray-500">
              Hi, <span className="font-semibold text-indigo-600">{auth.name}</span>
            </span>
          )}

          {!auth.name ? (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>

              {auth.role === "user" ? (
                <NavLink
                  to="/regularUser"
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                >
                  Shop
                </NavLink>
              ) : (
                <NavLink
                  to="/admin"
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                >
                  Admin
                </NavLink>
              )}

              <NavLink
                to="/profile"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Profile
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

     {/* Mobile Menu */}
{open && (
  <div className="md:hidden bg-white border-t shadow-xl px-5 py-6 space-y-2 animate-slideDown">
    
    {/* Navigation */}
    <NavLink
      to="/"
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg text-base font-medium transition
        ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      Home
    </NavLink>

    <NavLink
      to="/menu"
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg text-base font-medium transition
        ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      Menu
    </NavLink>

    <NavLink
      to="/contact"
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg text-base font-medium transition
        ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`
      }
    >
      Contact
    </NavLink>

    <hr className="my-3" />

    {/* Auth Section */}
    {!auth.name ? (
      <>
        <NavLink
          to="/login"
          className="block px-4 py-3 rounded-lg text-indigo-600 font-semibold hover:bg-indigo-50"
        >
          Login
        </NavLink>

        <NavLink
          to="/register"
          className="block px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-center hover:bg-indigo-700"
        >
          Register
        </NavLink>
      </>
    ) : (
      <>
        <NavLink
          to="/profile"
          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Profile
        </NavLink>

        {auth.role === "user" ? (
          <NavLink
            to="/regularUser"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Shop
          </NavLink>
        ) : (
          <NavLink
            to="/admin"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Admin
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-red-600 font-semibold hover:bg-red-50 transition"
        >
          Logout
        </button>
      </>
    )}
  </div>
)}

    </nav>
  );
};

export default Navbar;
