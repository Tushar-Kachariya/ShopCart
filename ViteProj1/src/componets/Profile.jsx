import React from "react";
import { NavLink } from "react-router-dom";

function Profile() {
  const user = {
    name: localStorage.getItem("name") || "Guest User",
    email: localStorage.getItem("email") || "user@email.com",
    role: localStorage.getItem("role") || "User",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 transition hover:shadow-3xl">

        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Profile
        </h2>

        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="text-center mt-6 space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {user.name}
          </h3>
          <p className="text-gray-500 text-sm">
            {user.email}
          </p>

          <span className="inline-block mt-2 px-4 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 font-medium">
            {user.role}
          </span>
        </div>

        <div className="mt-8 space-y-3">

          {user.role === "admin" ? (
            <NavLink to="/admin">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2.5 rounded-xl transition duration-200">
                Go to Admin Panel
              </button>
            </NavLink>
          ) : (
            <NavLink to="/userorder">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2.5 rounded-xl transition duration-200">
                My Orders
              </button>
            </NavLink>
          )}

          <NavLink to="/updateprofile">
            <button className="w-full border mt-4 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95 py-2.5 rounded-xl transition duration-200">
              Update Profile
            </button>
          </NavLink>

        </div>

      </div>
    </div>
  );
}

export default Profile;
