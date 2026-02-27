import { useState } from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios.js";
import { selectSubTotal, selectTotalPrice, selectCartItems } from "../features/cart/cartSelectors.js";
import {
  incQty,
  decQty,
  clearCart,
  removeItem,
} from "../features/cart/cartSlice.js";

export default function Cart() {

  const cartItems = useSelector(selectCartItems);
  const subTotal = useSelector(selectSubTotal);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = cartItems.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const navigate = useNavigate();
  const handelplacesubmit = async () => {
    try {
      const res = await api.post(
        "/RegularUser/place",
        { cartItems, totalPrice }
      );

      if (res.data.success) {
        console.log("Order placed successfully");
        dispatch(clearCart());
        navigate('/ordersuccess');
      } else {
        alert(res.data.message);
      }

    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";

      console.log("Backend error:", message);
      alert("Please complete login and your profile first");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Shopping Cart
            </h2>

            {cartItems.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <p className="text-lg font-medium">Your cart is empty 🛒</p>
                <p className="text-sm mt-2">
                  Add some products to continue shopping
                </p>
              </div>
            )}

            {currentProducts.map((p) => (
              <div
                key={p._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4"
              >
                {/* Left Section (Image + Info) */}
                <div
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="flex items-center gap-4 cursor-pointer flex-1"
                >
                  <img
                    src={
                      p.image
                        ? p.image.startsWith("data:") // base64
                          ? p.image
                          : p.image.startsWith("http") // already full url
                            ? p.image
                            : `http://localhost:5000${p.image}` // "/uploads/.."
                        : "https://via.placeholder.com/150"
                    }
                    alt={p.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-slate-800">{p.name}</h3>
                    <p className="text-sm text-slate-500">{p.category}</p>
                    <p className="font-semibold text-indigo-600 mt-1">
                      ₹{p.price}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decQty(p._id))}
                    className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-slate-100 font-semibold"
                  >
                    −
                  </button>

                  <span className="w-8 text-center font-medium">
                    {p.quantity}
                  </span>

                  <button
                    onClick={() => dispatch(incQty(p._id))}
                    className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-slate-100 font-semibold"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => dispatch(removeItem(p._id))}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}

            {currentProducts.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subTotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹50</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
              <button
                onClick={handelplacesubmit}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
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
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
