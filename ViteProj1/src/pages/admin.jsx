import React, { useState, useEffect } from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import axios from "axios";

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [view, setView] = useState("products");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (view === "products") getProduct();
    }, [view]);

    const getProduct = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/get", {
                withCredentials: true,
            });
            setProducts(res.data.products);
        } catch (error) {
            console.log(error.message);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(
                `http://localhost:5000/api/admin/delete/${id}`,
                { withCredentials: true }
            );
            getProduct();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex min-h-screen bg-slate-100">
                <aside className="w-64 bg-slate-900 text-slate-200 p-6">
                    <h2 className="text-2xl font-bold mb-8 text-white">Admin Panel</h2>

                    <ul className="space-y-3">
                        <li
                            onClick={() => setView("products")}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition
              ${view === "products"
                                    ? "bg-indigo-600 text-white"
                                    : "hover:bg-slate-700"
                                }`}
                        >
                            All Products
                        </li>

                        <li
                            onClick={() => setView("add")}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition
                                    ${view === "add"
                                    ? "bg-indigo-600 text-white"
                                    : "hover:bg-slate-700"
                                }`}
                        >
                            Add Product
                        </li>
                    </ul>
                </aside>

                <main className="flex-1 p-8">
                    {view === "products" && (
                        <>
                            <h1 className="text-3xl font-bold mb-6 text-slate-800">
                                All Products
                            </h1>

                            <div className="bg-white rounded-xl shadow overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-200 text-slate-700">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">Price</th>
                                            <th className="p-3">Description</th>
                                            <th className="p-3">Image</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr
                                                key={p._id}
                                                className="text-center border-t hover:bg-slate-50"
                                            >
                                                <td className="p-3">{p.name}</td>
                                                <td className="p-3 capitalize">{p.category}</td>
                                                <td className="p-3 font-semibold">₹{p.price}</td>
                                                <td className="p-3">{p.description}</td>
                                                <td className="p-3">
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-16 h-16 rounded-lg object-cover mx-auto"
                                                    />
                                                </td>
                                                <td className="p-3 space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setView("update");
                                                        }}
                                                        className="px-4 py-1 my-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(p._id)}
                                                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {view === "add" && <AddProduct setView={setView} />}
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
            reader.onloadend = () =>
                setData({ ...data, image: reader.result });
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setData({ ...data, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(
            "http://localhost:5000/api/admin/create",
            data,
            { withCredentials: true }
        );
        setView("products");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow max-w-2xl"
        >
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Add Product
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="text-sm font-medium">Product Name</label>
                    <input className="input" name="name" onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium">Price</label>
                    <input className="input" name="price" type="number" onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium">Category</label>
                    <select className="input" name="category" onChange={handleChange}>
                        <option value="">Select Category</option>
                        <option value="toys">Toys</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="books">Books</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Product Image</label>
                    <input className="input" type="file" name="image" onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        className="input h-28"
                        name="description"
                        onChange={handleChange}
                    />
                </div>

            </div>

            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
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

    const handleChange = (e) => {
        if (e.target.type === "file") {
            const reader = new FileReader();
            reader.onloadend = () =>
                setData({ ...data, image: reader.result });
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setData({ ...data, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put(
            `http://localhost:5000/api/admin/update/${product._id}`,
            data,
            { withCredentials: true }
        );
        setView("products");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow max-w-2xl"
        >
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Update Product
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="text-sm font-medium">Product Name</label>
                    <input className="input" name="name" value={data.name} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium">Price</label>
                    <input className="input" type="number" name="price" value={data.price} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium">Category</label>
                    <select className="input" name="category" value={data.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        <option value="toys">Toys</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="books">Books</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Change Image</label>
                    <input className="input" type="file" name="image" onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        className="input h-28"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
                Update Product
            </button>
        </form>
    );
}
