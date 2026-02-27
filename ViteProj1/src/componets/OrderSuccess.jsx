import React, { useEffect ,useState} from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const OrderSuccess = () => {
  const dispatch = useDispatch();
   const [auth, setAuth] = useState({
      name: localStorage.getItem("name")
    });

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />

            <span className="text-sm text-gray-500">
              Hey, <span className="font-semibold text-indigo-600">{auth.name}</span>
            </span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed Successfully 
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your order has been placed and is being processed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              View Orders
            </Link>

            <Link
              to="/regularUser"
              className="px-5 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderSuccess;
