import { useState, useEffect } from "react";
import api from "../api/axios";

function AdminShowOrder() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/getAdminOrder");
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {

      // instant UI update
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );

      // backend update
      await api.put(`/admin/updateOrderStatus/${id}`, { status });

    } catch (error) {
      console.log(error.response?.data || error.message);

      // fallback refresh
      fetchOrders();
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentOrders = filteredOrders.slice(firstIndex, lastIndex);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        All Orders
      </h1>

      {/* FILTER */}

      <div className="flex justify-end mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">

        <table className="w-full text-sm text-left">

          <thead className="bg-slate-100 text-slate-700 sticky top-0">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Products</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Shipping</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Billing</th>
            </tr>
          </thead>

          <tbody>

            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-slate-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  {/* CUSTOMER */}

                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {order.shippingAddress?.fullName}
                      </span>

                      <span className="text-xs text-slate-500">
                        {order.userId?.email}
                      </span>

                      <span className="text-xs text-slate-500">
                        {order.shippingAddress?.phone}
                      </span>
                    </div>
                  </td>

                  {/* PRODUCTS */}

                  <td className="p-4">
                    {order.products?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 mb-2"
                      >

                        <img
                          src={
                            item.productId?.image
                              ? item.productId.image.startsWith("http")
                                ? item.productId.image
                                : `http://localhost:5000${item.productId.image}`
                              : item.image
                              ? `http://localhost:5000${item.image}`
                              : "https://via.placeholder.com/40"
                          }
                          className="w-10 h-10 rounded-lg object-cover border"
                        />

                        <div className="text-xs">
                          <p className="font-medium">
                            {item.productId?.name || item.name}
                          </p>

                          <p className="text-slate-500">
                            Qty: {item.quantity} • ₹{item.price}
                          </p>
                        </div>

                      </div>
                    ))}
                  </td>

                  {/* TOTAL */}

                  <td className="p-4 font-semibold text-indigo-600">
                    ₹{order.totalAmount}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;

                        if (newStatus !== order.status) {
                          handleStatusChange(order._id, newStatus);
                        }
                      }}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  {/* DATE */}

                  <td className="p-4 text-xs text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* SHIPPING */}

                  <td className="p-4 text-xs text-slate-600">
                    {order.shippingAddress
                      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`
                      : "-"}
                  </td>

                  {/* PAYMENT */}

                  <td className="p-4 text-xs font-medium">
                    {order.paymentMethod}
                  </td>

                  {/* BILLING */}

                  <td className="p-4 text-xs text-slate-600">
                    {order.billingAddress
                      ? `${order.billingAddress.address}, ${order.billingAddress.city}, ${order.billingAddress.state}`
                      : "-"}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 bg-slate-200 rounded"
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
            className="px-3 py-1 bg-slate-200 rounded"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminShowOrder;