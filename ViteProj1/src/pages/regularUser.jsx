import React, { useEffect, useState } from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { addToCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { selectCartItems } from "../features/cart/cartSelectors";
import { useLoading } from "../global/LoadingContext";

export default function RegularUser() {
  const { showLoader, hideLoader } = useLoading();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItems);

  const isInCart = (id) => {
    return cartItem.some((item) => item._id === id);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      
      try {
        
        const res = await api.get(
          `/RegularUser/SearchProduct?search=${query}`
        );
        setProducts(res.data);
      } catch (error) {
        console.log("Search Error:", error.message);
      } 
    };

    fetchProducts();
  }, [query]);


  const getProduct = async () => {
    try {
      const res = await api.get("/RegularUser/getProduct");
      setProducts(res.data.products);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

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

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Explore Products", desc: "Latest items available now." },
            { title: "Orders", desc: "Track your recent purchases." },
            { title: "Notifications", desc: "Get updates & alerts." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Latest Products
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">


            <input
              type="text"
              placeholder="Search product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products available</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {currentProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition duration-300 overflow-hidden flex flex-col cursor-pointer"
                  >
                    <img
                      src={product.image || `http://localhost:5000${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>

                      <p className="text-blue-600 font-bold text-lg mt-1">
                        ₹{product.price}
                      </p>

                      <p className="text-lg mt-1 font-bold">
                        {product.instock === 0 ? (
                          <span className="text-red-600">Out of Stock</span>
                        ) : (
                          <span className="text-green-600">In Stock</span>
                        )}
                      </p>

                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
                        {product.description}
                      </p>

                      {product.instock > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            if (!isInCart(product._id)) {
                              dispatch(
                                addToCart({
                                  _id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  category: product.category,
                                  instock: product.instock,
                                  image: product.image || product.images?.[0] || null,
                                  images: product.images || [],
                                })
                              );
                            }
                          }}
                          className={`mt-4 w-full py-2 rounded-lg transition active:scale-95
                           ${isInCart(product._id)
                              ? "bg-green-600 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                          {isInCart(product._id) ? "Added to Cart " : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 rounded bg-slate-300 hover:bg-slate-400 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 rounded bg-slate-300 hover:bg-slate-400 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
