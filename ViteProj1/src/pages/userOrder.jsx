import { useState, useEffect } from 'react'
import Navbar from '../componets/Navbar';
import api from '../api/axios';
import Footer from '../componets/Footer';

export default function userOrder() {
    const [order, setOrder] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get("/user/getuserorder");
            setOrder(data.order || []);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };



    const totalPages = Math.ceil(order.length / itemsPerPage);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentOrders = order.slice(firstIndex, lastIndex);

    return (
        <>
            <Navbar />
            <h1 className="text-3xl font-bold mb-6 text-slate-800">
                All Orders
            </h1>
            <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Contact No</th>
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
                                <tr
                                    key={u._id}
                                    className="border-b hover:bg-slate-50 transition"
                                >
                                    <td className="p-4 text-center">
                                        {u.userId?.email}
                                    </td>

                                    <td className="p-4 text-center">
                                        {u.userId?.address?.phone || "-"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {u.products?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 mb-1"
                                            >
                                                <img
                                                    src={
                                                        item.productId?.image ||
                                                        item.image
                                                    }
                                                    alt={
                                                        item.productId?.name ||
                                                        item.name
                                                    }
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                                <span>
                                                    {item.productId?.name ||
                                                        item.name}{" "}
                                                    (x{item.quantity})
                                                </span>
                                            </div>
                                        ))}
                                    </td>

                                    <td className="p-4 text-center font-semibold">
                                        ₹{u.totalAmount}
                                    </td>

                                    <td className="p-4 text-center">
                                        {u.status}
                                    </td>

                                    <td className="p-4 text-center">
                                        {new Date(
                                            u.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-4 text-left text-xs">
                                        {u.userId?.address ? (
                                            <>
                                                <div>
                                                    {
                                                        u.userId.address
                                                            .street
                                                    }
                                                    ,{" "}
                                                    {
                                                        u.userId.address.city
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        u.userId.address.state
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        u.userId.address
                                                            .postalCode
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        u.userId.address
                                                            .country
                                                    }
                                                </div>
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
            )}
            <Footer />
        </>
    );
}