import { useState, useEffect, use } from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { Users } from "lucide-react";

import { LayoutDashboard, PlusCircle, Menu } from "lucide-react";
import api from "../api/axios";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    if (view === "products") getProduct();
  }, [view]);

  const getProduct = async () => {
    try {
      const res = await api.get("/admin/get", { withCredentials: true });
      setProducts(res.data.products);
      setCurrentPage(1);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/delete/${id}`, { withCredentials: true });
      getProduct();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        {/* SIDEBAR */}
        <aside
          className={`${open ? "w-64" : "w-20"} bg-slate-900 text-slate-200 p-4 transition-all duration-300`}
        >
          <div className={`flex items-center ${open ? "justify-between" : "justify-center"} mb-8`}>
            {open && <h2 className="text-xl font-bold text-white">Admin Panel</h2>}
            <Menu
              size={22}
              className="cursor-pointer text-white hover:text-indigo-400 transition"
              onClick={() => setOpen(!open)}
            />
          </div>

          <ul className="space-y-3">
            <li
              onClick={() => setView("products")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                            ${view === "products" ? "bg-indigo-600 text-white" : "hover:bg-slate-700"}`}
            >
              <LayoutDashboard size={20} />
              {open && <span>All Products</span>}
            </li>

            <li
              onClick={() => setView("add")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                            ${view === "add" ? "bg-indigo-600 text-white" : "hover:bg-slate-700"}`}
            >
              <PlusCircle size={20} />
              {open && <span>Add Product</span>}
            </li>

            <li
              onClick={() => setView("users")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
    ${view === "users"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-700"
                }`}
            >
              <Users size={20} />
              {open && <span>All Users</span>}
            </li>

          </ul>
        </aside>

        <main className="flex-1 p-6 lg:p-8 bg-slate-100">
          {view === "products" && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-slate-800">
                All Products
              </h1>

              <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b">
                    <tr className="text-left">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Description</th>
                      <th className="p-4 font-semibold text-center">Image</th>
                      <th className="p-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentProducts.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b hover:bg-slate-50 transition"
                      >
                        <td className="p-4 font-medium text-slate-800">
                          {p.name}
                        </td>

                        <td className="p-4 capitalize text-slate-600">
                          {p.category}
                        </td>

                        <td className="p-4 font-semibold text-indigo-600">
                          ₹{p.price}
                        </td>

                        <td className="p-4 text-slate-600 max-w-xs truncate">
                          {p.description}
                        </td>

                        <td className="p-4">
                          <img
                            src={p.image}
                            className="w-14 h-14 rounded-xl object-cover mx-auto"
                            alt={p.name}
                          />
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                setView("update");
                              }}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteProduct(p._id)}
                              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm transition"
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

              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow">
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
                      className={`px-3 py-1 rounded transition ${currentPage === i + 1
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
            </>
          )}

          {view === "add" && <AddProduct setView={setView} />}
          {view === "users" && <AdminUsers setView={setView} />}
          {view === "update" && (
            <UpdateProduct setView={setView} product={selectedProduct} />
          )}
        </main>

      </div>

      <Footer />
    </>
  );
}


function AddProduct({ setView }) {
  const [data, setData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const reader = new FileReader();
      reader.onloadend = () => setData({ ...data, image: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/admin/create", data, { withCredentials: true });
    setView("products");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" name="name" placeholder="Name" onChange={handleChange} />
        <input className="input" placeholder="price" name="price" type="number" min={0} max={10000} onChange={handleChange} />
        <select className="input" name="category" onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="toys">Toys</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
        <input className="input" type="file" name="image" onChange={handleChange} />
        <textarea placeholder="description" className="input md:col-span-2 h-28" name="description" onChange={handleChange} />
      </div>
      <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg">
        Add Product
      </button>
    </form>
  );
}


function UpdateProduct({ setView, product }) {
  const [data, setData] = useState(product);

  useEffect(() => {
    if (product) setData(product);
  }, [product]);

  if (!data) return null;

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const reader = new FileReader();
      reader.onloadend = () => setData({ ...data, image: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/admin/update/${product._id}`, data, { withCredentials: true });
    setView("products");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" name="name" value={data.name} onChange={handleChange} />
        <input className="input" name="price" type="number" value={data.price} onChange={handleChange} />
        <select className="input" name="category" value={data.category} onChange={handleChange}>
          <option value="toys">Toys</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
        <input className="input" type="file" name="image" onChange={handleChange} />
        <textarea className="input md:col-span-2 h-28" name="description" value={data.description} onChange={handleChange} />
      </div>
      <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg">
        Update Product
      </button>
    </form>
  );
}




function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await api.get("/user/getallUser", {
      withCredentials: true,
    });
    setUsers(data.user);
  };

  const toggleBlock = async (id) => {
    await api.put(`/user/updateuser/${id}`, {}, { withCredentials: true });
    fetchUsers();
  };

  const normalUsers = users.filter((u) => u.role === "user");

  const totalPages = Math.ceil(normalUsers.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentUsers = normalUsers.slice(firstIndex, lastIndex);

  return (
    <>
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
              <th className="p-4 text-center">Block</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((u) => (
              <tr key={u._id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 font-medium">{u.userName}</td>
                <td className="p-4">{u.email}</td>

                <td className="p-4 capitalize">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    {u.role}
                  </span>
                </td>

                <td className="p-4">{u.address?.phone || "-"}</td>
                <td className="p-4">{u.address?.city || "-"}</td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`relative w-11 h-6 rounded-full transition ${
                      u.isBlocked ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${
                        u.isBlocked ? "left-0.5" : "left-5"
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </>
  );
}
