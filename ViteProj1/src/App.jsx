import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../src/pages/Register.jsx";
import Login from "../src/pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Admin from "./pages/admin.jsx";
import RegularUser from "./pages/regularUser.jsx";
import { ProtectedRoute, RedirectIfLoggedIn, RestrictForAdmin, RestrictForUser } from "./ProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
        <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
        <Route path='/' element={<Home />} />
        <Route path='/regularUser' element={<ProtectedRoute><RestrictForAdmin><RegularUser /></RestrictForAdmin></ProtectedRoute>} />
        <Route
          path='/admin'
          element={
            <ProtectedRoute >
              <RestrictForUser><Admin /></RestrictForUser>
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}
