import { useState, useEffect } from "react";
import api from "../api/axios";

function AdminShowOrder() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [order, setOrder] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get("/admin/getAdminOrder");
            setOrder(data.order || []);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/admin/updateOrderStatus/${id}`, { status });

            setOrder(prev =>
                prev.map(order =>
                    order._id === id ? { ...order, status } : order
                )
            );

        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    };



    const filteredOrders = statusFilter === "All" ? order : order.filter((o) => o.status === statusFilter);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentOrders = filteredOrders.slice(firstIndex, lastIndex);
    return (
        <>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">
                All Orders
            </h1>

            <div className="mb-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                >
                    <option value="All">All Orders</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Contact</th>
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
                                <td colSpan="7" className="text-center p-4">
                                    No Orders Found
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map((u) => (
                                <tr key={u._id} className="border-b hover:bg-slate-50">
                                    <td className="p-4 text-center">{u.userId?.email}</td>

                                    <td className="p-4 text-center">
                                        {u.userId?.address?.phone || "-"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {u.products?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-1">
                                                <img
                                                    src={item.productId?.image || item.image}
                                                    alt={item.productId?.name || item.name}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                                <span>
                                                    {item.productId?.name || item.name} (x{item.quantity})
                                                </span>
                                            </div>
                                        ))}
                                    </td>

                                    <td className="p-4 text-center font-semibold">
                                        ₹{u.totalAmount}
                                    </td>

                                    <td className="p-4 text-center">
                                        <select
                                            value={u.status}
                                            onChange={(e) =>
                                                handleStatusChange(u._id, e.target.value)
                                            }
                                            className="px-3 py-1 rounded-full text-xs font-semibold border"
                                        >
                                            <option>Pending</option>
                                            <option>Confirmed</option>
                                            <option>Shipped</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>

                                    <td className="p-4 text-center">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="p-4 text-xs">
                                        {u.userId?.address
                                            ? `${u.userId.address.street}, ${u.userId.address.city}, ${u.userId.address.state}`
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {currentOrders.length === 0 ? (
                    <div className="text-center p-4 bg-white rounded-xl shadow">
                        No Orders Found
                    </div>
                ) : (
                    currentOrders.map((u) => (
                        <div key={u._id} className="bg-white rounded-2xl shadow p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{u.userId?.email}</p>
                                    <p className="text-sm text-gray-500">
                                        {u.userId?.address?.phone || "-"}
                                    </p>
                                </div>

                                <span className="text-indigo-600 font-bold">
                                    ₹{u.totalAmount}
                                </span>
                            </div>

                            <div className="mt-3 text-sm space-y-2">
                                {u.products?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <img
                                            src={item.productId?.image || item.image}
                                            className="w-8 h-8 rounded object-cover"
                                        />
                                        <span>
                                            {item.productId?.name || item.name} (x{item.quantity})
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <select
                                    value={u.status}
                                    onChange={(e) =>
                                        handleStatusChange(u._id, e.target.value)
                                    }
                                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                                >
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>

                                <span className="text-xs text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </span>
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
        </>
    );
}

export default AdminShowOrder;
