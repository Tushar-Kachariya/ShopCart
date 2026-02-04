import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Shop<span className="text-blue-500">Cart</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Shop smarter, faster, and better — all in one place.
          </p>

        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">Shop</li>
            <li className="hover:text-white transition cursor-pointer">Orders</li>
            <li className="hover:text-white transition cursor-pointer">Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Follow Us
          </h3>
          <div className="flex gap-4 text-sm">
            <span className="hover:text-blue-500 cursor-pointer transition">
              Facebook
            </span>
            <span className="hover:text-blue-500 cursor-pointer transition">
              Twitter
            </span>
            <span className="hover:text-blue-500 cursor-pointer transition">
              Instagram
            </span>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} ShopCart. All rights reserved.
      </div>
    </footer>
  );
}
