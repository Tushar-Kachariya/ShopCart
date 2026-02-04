import React from "react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { NavLink } from "react-router-dom";

function Home() {

  const user = localStorage.getItem('name');
  return (
    <>
      <Navbar />

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center px-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">ShopCart</span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            A smooth shopping experience with smart cart management and secure checkout.
          </p>


          <div className="flex justify-center gap-4">
            <NavLink to='/login'> <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Go shopping 
            </button></NavLink>

            {
              user ?
                <NavLink to='/profile'>
                  <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition">
                    Profile Info
                  </button>
                </NavLink>
                :
                <NavLink to='/login'>
                  <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition">
                    Login Now
                  </button>
                </NavLink>

            }
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
