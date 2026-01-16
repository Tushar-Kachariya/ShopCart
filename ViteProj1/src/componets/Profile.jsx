import React from "react";
import { NavLink } from "react-router-dom";

function Profile() {
    const user = {
        name: localStorage.getItem("name") || "Guest User",
        email: localStorage.getItem("email") || "user@email.com",
        role: localStorage.getItem("role") || "User",
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6">
                <h2 className="  text-3xl font-bold p-2">Profile :</h2>

                <div className="flex justify-center">
                    <div className="h-24 w-24  rounded-full bg-indigo-600 text-white flex items-center justify-center text-5xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="text-center mt-4">

                    <h2 className="text-2xl font-semibold text-gray-800">
                       Name: {user.name}
                    </h2>
                    <p className="text-gray-500">Eamil: {user.email}</p>

                    <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600">
                        Role: {user.role}
                    </span>
                </div>

                <div className="mt-6 space-y-3">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
                        {(user.role === 'admin') ? <NavLink to="/admin">
                            <button >
                                Admin
                            </button>
                        </NavLink>
                            :
                            <NavLink to="/regularUser">
                                <button >
                                    Shop
                                </button>
                            </NavLink>
                        }
                    </button>


                </div>
            </div>
        </div>
    );
}

export default Profile;
