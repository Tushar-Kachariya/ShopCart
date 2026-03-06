import { useState, useEffect } from "react";
import Navbar from "../componets/Navbar";
import api from "../api/axios";
import Footer from "../componets/Footer";

export default function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get("/user/getuserorder", {
        withCredentials: true,
      });

      setOrders(data.orders || []); // FIXED
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentOrders = orders.slice(firstIndex, lastIndex);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">
          My Orders
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Products</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Address</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    {/* NAME */}
                    <td className="p-4 text-center">
                      {order.shippingAddress?.fullName || "-"}
                    </td>

                    {/* PHONE */}
                    <td className="p-4 text-center">
                      {order.shippingAddress?.phone || "-"}
                    </td>

                    {/* PRODUCTS */}
                    <td className="p-4 text-left">
                      {order.products?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <img
                            src={
                              item.image
                                ? item.image.startsWith("http")
                                  ? item.image
                                  : `http://localhost:5000${item.image}`
                                : "https://via.placeholder.com/40"
                            }
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>
                            {item.name} (x{item.quantity})
                          </span>
                        </div>
                      ))}
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 text-center font-semibold">
                      ₹{order.totalAmount}
                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          order.status === "Pending"
                            ? "bg-yellow-500"
                            : order.status === "Completed"
                            ? "bg-green-600"
                            : order.status === "Cancelled"
                            ? "bg-red-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* ADDRESS */}
                    <td className="p-4 text-xs">
                      {order.shippingAddress ? (
                        <>
                          <div>{order.shippingAddress.address}</div>
                          <div>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}
                          </div>
                          <div>{order.shippingAddress.pincode}</div>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
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
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
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
        )}
      </div>

      <Footer />
    </>
  );
}