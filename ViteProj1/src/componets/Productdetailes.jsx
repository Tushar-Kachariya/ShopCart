import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  incQty,
  decQty,
} from "../features/cart/cartSlice";

export default function ProductDetailsView() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(
          `/RegularUser/getproduct/${id}`
        );
        setProduct(data.product);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-red-500">
        Product not found
      </div>
    );
  }
  const nextImage = () => {
    if (currentIndex < product.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const quantity =
    cartItems.find(
      (item) => item._id === product._id
    )?.quantity || 0;

  const inStock = product.instock;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-8">

          <div className="bg-white rounded-2xl shadow-md p-6 grid md:grid-cols-2 gap-8">

            <div className="relative w-full">

              <img
                src={product.image || `http://localhost:5000${product.images[currentIndex]}`}
                alt={product.name}
                className="w-full h-[450px] object-cover rounded-xl"
              />
              {currentIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 text-white px-3 py-2 rounded-full"
                >
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
                  </svg>
                </button>
              )}

              {currentIndex < product.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 text-white px-3 py-2 rounded-full"
                >
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
                  </svg>
                </button>
              )}

            </div>

            <div>
              <div className="relative bg-white p-6 rounded-lg ">

                <button
                  onClick={() => navigate("/regularuser")}
                  className="absolute top-2 right-2 backdrop-blur-md bg-white-700 font-bold border-2 border-black text-white px-3 py-2 rounded-md">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                  </svg>

                </button>
                <h1 className="text-3xl mb-2 font-bold">
                  {product.name}
                </h1>

                <h2 className=" text-2xl ">{product.category}</h2>

                <p className=" text-indigo-600 font-bold mt-2">
                  ₹{product.price}
                </p>

                {product.instock === 0 && (
                  <p className="text-red-600 font-bold mt-2">
                    Out of Stock
                  </p>
                )}

                {product.instock > 0 && (
                  <span className="text-green-600">
                    In Stock : {product.instock}
                  </span>
                )}


                <p className="mt-4 text-gray-600">
                  {product.description}
                </p>

                {quantity > 0 && (
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      disabled={quantity <= 1}
                      onClick={() =>
                        dispatch(decQty(product._id))
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-md font-semibold"
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold">
                      {quantity}
                    </span>

                    <button
                      onClick={() => dispatch(incQty(product._id))}
                      className={`w-8 h-8 flex items-center justify-center border rounded-md font-semibold
                       ${product.quantity >= product.instock
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-slate-100"
                        }`}
                    >
                      +
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  {product.instock > 0 &&

                    <button
                      onClick={() =>
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
                        )
                      }
                      className={`px-6 py-3 rounded-lg transition duration-300 ${quantity > 0
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                    >
                      {quantity > 0 ? "Added to Cart" : "Add to Cart"}
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <Footer />
    </>
  );
}