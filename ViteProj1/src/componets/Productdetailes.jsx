import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
                >
                  ◀
                </button>
              )}

              {currentIndex < product.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
                >
                  ▶
                </button>
              )}

            </div>

            <div>
              <div className="relative bg-white p-6 rounded-lg ">

                <button
                  onClick={() => navigate("/regularuser")}
                  className="absolute top-2 right-2 backdrop-blur-md bg-white-700 font-bold border-2 border-black text-white px-3 py-2 rounded-md">
                  ❌
                </button>
                <h1 className="text-3xl mb-2 font-bold">
                  {product.name}
                </h1>

                <h2 className=" text-2xl ">{product.category}</h2>

                <p className=" text-indigo-600 font-bold mt-2">
                  ₹{product.price}
                </p>

                <p className=" font-bold mt-2">
                  Instock : {product.instock}
                </p>


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
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    {quantity > 0 ? "Added to Cart" : "Add to Cart"}
                  </button>
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