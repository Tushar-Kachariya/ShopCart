import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/user/getallUser");
      setUsers(data.user || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/deleteUser/${deleteId}`);

      setUsers((prev) => prev.filter((u) => u._id !== deleteId));

      setShowModal(false);
      setDeleteId(null);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await api.put(`/user/block/${id}`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const normalUsers = users.filter((u) => u.role === "user");

  const totalPages = Math.ceil(normalUsers.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentUsers = normalUsers.slice(firstIndex, lastIndex);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">
        All Users
      </h1>

      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Phone</th>
              <th className="p-4 text-center">City</th>
              <th className="p-4 text-center">Delete</th>
              <th className="p-4 text-center">Block</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No Users Found
                </td>
              </tr>
            ) : (
              currentUsers.map((u) => (
                <tr key={u._id} className="border-b hover:bg-slate-50">
                  <td className="p-4 text-center font-medium">
                    {u.userName}
                  </td>
                  <td className="p-4 text-center">{u.email}</td>
                  <td className="p-4 text-center capitalize">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {u.address?.phone || "-"}
                  </td>
                  <td className="p-4 text-center">
                    {u.address?.city || "-"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openDeleteModal(u._id)}
                      className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleBlock(u._id)}
                      className={`relative w-11 h-6 rounded-full transition ${u.isBlocked ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${u.isBlocked ? "left-0.5" : "left-5"
                          }`}
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {currentUsers.length === 0 ? (
          <div className="text-center p-4 bg-white rounded-xl shadow">
            No Users Found
          </div>
        ) : (
          currentUsers.map((u) => (
            <div key={u._id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">
                    {u.userName}
                  </h2>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  {u.role}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p>📞 {u.address?.phone || "-"}</p>
                <p>🏙 {u.address?.city || "-"}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openDeleteModal(u._id)}
                  className="flex-1 py-2 bg-rose-600 text-white rounded-lg"
                >
                  Delete
                </button>

                <button
                  onClick={() => toggleBlock(u._id)}
                  className={`flex-1 py-2 rounded-lg text-white ${u.isBlocked
                      ? "bg-rose-500"
                      : "bg-emerald-500"
                    }`}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex flex-wrap gap-2 bg-white px-4 py-2 rounded-xl shadow">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 rounded bg-slate-200 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 rounded bg-slate-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-3">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
