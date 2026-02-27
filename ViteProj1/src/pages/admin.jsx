import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const getProduct = async () => {
    try {
      const res = await api.get("/admin/get", {
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProduct();
    
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/delete/${id}`, {
        withCredentials: true,
      });

      const updatedProducts = products.filter((p) => p._id !== id);
      setProducts(updatedProducts);

      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">
          All Products
        </h1>

        <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">quantity</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Image</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((p) => (
                <tr key={p._id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 capitalize">{p.category}</td>
                  <td className="p-4 font-semibold text-indigo-600">
                    ₹{p.price}
                  </td>
                  <td className="p-4 font-semibold text-indigo-600">
                    {p.instock}
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="p-4">
                    <img
                      src={
                        p.image ||
                        `http://localhost:5000${p.images?.[0]}`
                      }
                      className="w-14 h-14 rounded-xl object-cover mx-auto"
                      alt={p.name}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit/${p._id}`)
                        }
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {currentProducts.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex gap-4">
                <img
                  src={
                    p.image ||
                    `http://localhost:5000${p.images?.[0]}`
                  }
                  className="w-20 h-20 rounded-xl object-cover"
                  alt={p.name}
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{p.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {p.category}
                  </p>
                  <p className="text-indigo-600 font-bold">
                    ₹{p.price}
                  </p>
                  <p className="text-indigo-600 font-bold">
                    {p.instock || "-"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                {p.description}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    navigate(`/admin/edit/${p._id}`)
                  }
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 py-2 bg-rose-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            <div className="flex flex-wrap gap-2 bg-white px-4 py-2 rounded-xl shadow">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
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
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}