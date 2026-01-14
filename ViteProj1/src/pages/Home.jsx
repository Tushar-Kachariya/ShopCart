import React from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center px-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">ShopCart</span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Build modern, fast, and scalable ecommerce applications using
            React & Tailwind CSS.
          </p>

          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Get Started
            </button>

            <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
