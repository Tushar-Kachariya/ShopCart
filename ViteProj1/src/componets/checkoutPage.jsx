import { useState } from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios.js";
import {
  selectSubTotal,
  selectCartItems,
} from "../features/cart/cartSelectors.js";
import { clearCart } from "../features/cart/cartSlice";
import { z } from "zod";

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const subTotal = useSelector(selectSubTotal);

  const shippingCharge = 50;
  const finalTotal = subTotal + shippingCharge;

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");


  const schema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  });


  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleBillingChange = (e) => {
    setBillingAddress({
      ...billingAddress,
      [e.target.name]: e.target.value,
    });
  };


  const handlePlaceSubmit = async () => {
    const result = schema.safeParse(shippingAddress);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await api.post("/RegularUser/place", {
        cartItems,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod,
      });

      if (res.data.success) {
        dispatch(clearCart());
        navigate("/ordersuccess");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-4 py-10">

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 space-y-8">


          <div>
            <h2 className="text-xl font-bold mb-4">Order Items</h2>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-4 mb-4"
              >

                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `http://localhost:5000${item.image}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p>₹{item.price}</p>
                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

              </div>
            ))}

            <div className="flex justify-between mt-4">
              <span>Shipping</span>
              <span>₹{shippingCharge}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>


          <div>
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleShippingChange}
                  className="border p-2 rounded w-full"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  name="phone"
                  placeholder="Phone"
                  onChange={handleShippingChange}
                  className="border p-2 rounded w-full"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <input
                  name="address"
                  placeholder="Address"
                  onChange={handleShippingChange}
                  className="border p-2 rounded w-full"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>

              <div>
                <input
                  name="city"
                  placeholder="City"
                  onChange={handleShippingChange}
                  className="border p-2 rounded w-full"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>

              <div>
                <input
                  name="state"
                  placeholder="State"
                  onChange={handleShippingChange}
                  className="border p-2 rounded w-full"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state}</p>
                )}
              </div>

              <div>
                <input
                  name="pincode"
                  placeholder="Pincode"
                  onChange={handleShippingChange}
                  className="border p-2 rounded w-full"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm">{errors.pincode}</p>
                )}
              </div>

            </div>
          </div>


          <div>
            <h2 className="text-xl font-bold mb-4">Billing Address</h2>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
              />
              Same as Shipping Address
            </label>

            {!sameAsShipping && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleBillingChange}
                  className="border p-2 rounded"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  onChange={handleBillingChange}
                  className="border p-2 rounded"
                />

                <input
                  name="address"
                  placeholder="Address"
                  onChange={handleBillingChange}
                  className="border p-2 rounded md:col-span-2"
                />

                <input
                  name="city"
                  placeholder="City"
                  onChange={handleBillingChange}
                  className="border p-2 rounded"
                />

                <input
                  name="state"
                  placeholder="State"
                  onChange={handleBillingChange}
                  className="border p-2 rounded"
                />

                <input
                  name="pincode"
                  placeholder="Pincode"
                  onChange={handleBillingChange}
                  className="border p-2 rounded"
                />

              </div>
            )}
          </div>


          <div>
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash On Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Online"
                checked={paymentMethod === "Online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment
            </label>
          </div>


          <button
            onClick={handlePlaceSubmit}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            {isLoading ? "Placing Order..." : "Place Order"}
          </button>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default CheckoutPage;