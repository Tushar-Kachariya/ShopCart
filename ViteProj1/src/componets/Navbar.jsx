import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { Menu, X } from "lucide-react";
import { clearCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [auth, setAuth] = useState({
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
  });

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });

      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      dispatch(clearCart());
      setAuth({ name: null, role: null });

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = ({ isActive }) =>
    `transition font-medium ${isActive
      ? "text-indigo-600"
      : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <NavLink
          to="/"
          className="text-2xl font-extrabold text-indigo-600 select-none"
        >
          Shop<span className="text-gray-900">Cart</span>
        </NavLink>

        <ul className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/" className={linkClass}>Menu</NavLink>
          <NavLink to="/" className={linkClass}>Contact</NavLink>
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
                <>
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
                </>
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

        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white border-t shadow-lg px-4 py-6 space-y-3 overflow-y-auto">

          <NavLink to="/" className="block px-4 py-3 rounded-lg hover:bg-gray-100">
            Home
          </NavLink>

          <NavLink to="/" className="block px-4 py-3 rounded-lg hover:bg-gray-100">
            Menu
          </NavLink>

          <NavLink to="/" className="block px-4 py-3 rounded-lg hover:bg-gray-100">
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
                className="block px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-center hover:bg-indigo-700"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className="block px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                Profile
              </NavLink>

              {auth.role === "user" ? (
                <>
                  <NavLink
                    to="/regularUser"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100"
                  >
                    Shop
                  </NavLink>

                  <NavLink
                    to="/cart"
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100"
                  >
                    Cart
                  </NavLink>
                </>
              ) : (
                <NavLink
                  to="/admin"
                  className="block px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  Admin
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-600 font-semibold hover:bg-red-50"
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