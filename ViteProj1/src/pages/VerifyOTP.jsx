import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/user/verify-otp", {
        email,
        otp
      });

      alert("Email verified successfully");

      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          Verify OTP
        </h1>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Verify OTP
        </button>

      </form>

    </div>
    <Footer/>
    </>
  );
}