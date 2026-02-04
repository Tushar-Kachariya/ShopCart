import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/user/getallUser");
      setUsers(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/user/deleteuser/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
        <Navbar/>
      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        All Users
      </h1>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4">City</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium">{u.userName}</td>

                <td className="p-4 text-slate-600">{u.email}</td>

                <td className="p-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${u.role === "admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                      }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="p-4">
                  {u.address?.phone || "-"}
                </td>

                <td className="p-4">
                  {u.address?.city || "-"}
                </td>

                <td className="p-4">
                  {u.isBlocked ? (
                    <span className="text-rose-600 font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">
                      Active
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
  );
}
