import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Admin from "./pages/admin";
import RegularUser from "./pages/regularUser";
import ProductDetailsView from "./componets/Productdetailes";

import {
  ProtectedRoute,
  RedirectIfLoggedIn,
  RestrictForAdmin,
  RestrictForUser,
} from "./ProtectedRoute";

import ProfilePage from "./pages/ProfilePage";
import Cart from "./pages/Cart";
import OrderSuccess from "./componets/OrderSuccess";
import AdminUsers from "./componets/AdminUsers";
import UpdateProfile from "./pages/UpdateProfile";
import AdminShowOrder from "./pages/AdminShowOrder";
import UserOrder from "./pages/userOrder";
import AddProduct from "./componets/AddProduct";
import UpdateProduct from "./componets/UpdateProduct";

export default function App() {
  return (
    <div className="select-non">
      <Routes>

        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Register />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />

        <Route path="/" element={<Home />} />

        <Route
          path="/userorder"
          element={
            <ProtectedRoute>
              <UserOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ordersuccess"
          element={
            <ProtectedRoute>
              <RestrictForAdmin>
                <OrderSuccess />
              </RestrictForAdmin>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            
              <RestrictForAdmin>
                <Cart />
              </RestrictForAdmin>
            
          }
        />

        <Route
          path="/product/:id"
          element={
            
              <RestrictForAdmin>
                <ProductDetailsView />
              </RestrictForAdmin>
            
          }
        />

        <Route
          path="/regularuser"
          element={
            
              <RestrictForAdmin>
                <RegularUser />
              </RestrictForAdmin>
            
          }
        />

        <Route
          path="/updateprofile"
          element={
            <ProtectedRoute>
              <RestrictForAdmin>
                <UpdateProfile />
              </RestrictForAdmin>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RestrictForUser>
                <AdminDashboard />
              </RestrictForUser>
            </ProtectedRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="edit/:id" element={<UpdateProduct />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminShowOrder />} />
        </Route>



      </Routes>
    </div>
  );
}
