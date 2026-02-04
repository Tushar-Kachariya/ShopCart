import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Menu, X } from "lucide-react";
import { clearCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [auth, setAuth] = useState({
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
  });

   const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      //for clear cart
      dispatch(clearCart());
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
    `transition font-medium ${
      isActive
        ? "text-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <NavLink
          to="/"
          className="text-2xl font-extrabold text-indigo-600 select-none"
        >
          Shop<span className="text-gray-900">Cart</span>
        </NavLink>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/" className={linkClass}>Menu</NavLink>
          <NavLink to="/" className={linkClass}>Contact</NavLink>
        </ul>

        {/* DESKTOP AUTH */}
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
                <div className="flex gap-2">
                  <NavLink
                    to="/regularUser"
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                  >
                    Shop
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                  >
                    Cart
                  </NavLink>
                </div>
              ) : (
                <NavLink
                  to="/admin"
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                >
                  Admin
                </NavLink>
              )}

              <NavLink
                to="/profile"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Profile
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-5 space-y-2 animate-slideDown">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Menu
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Contact
          </NavLink>

          <hr className="my-3" />

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
                className="block px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-center hover:bg-indigo-700 transition"
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
