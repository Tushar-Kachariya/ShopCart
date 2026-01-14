import React, { useEffect, useState } from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import axios from "axios";

export default function RegularUser() {
  const [products, setProducts] = useState([]);

  const getProduct = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/RegularUser/getProduct",
        { withCredentials: true }
      );
      setProducts(res.data.products);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
  <Navbar />

  {/* Hero Section */}
  <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Welcome Back 👋
      </h1>
      <p className="text-lg md:text-xl mb-8 text-blue-100">
        Discover new products and manage everything in one place.
      </p>
      <button className="bg-white text-blue-600 px-10 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
        Explore Products
      </button>
    </div>
  </section>

  <main className="flex-grow container mx-auto px-4 py-14">

    {/* Dashboard Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {[
        { title: "Explore Products", desc: "Latest items available now." },
        { title: "Orders", desc: "Track your recent purchases." },
        { title: "Notifications", desc: "Get updates & alerts." },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {item.title}
          </h2>
          <p className="text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* Products */}
    <section>
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        Latest Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-44 object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>

                <p className="text-blue-600 font-bold text-lg mt-1">
                  ₹{product.price}
                </p>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {product.description}
                </p>

                <button className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </main>

  <Footer />
</div>

  );
}
