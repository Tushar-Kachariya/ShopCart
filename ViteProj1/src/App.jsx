import { Routes, Route } from "react-router-dom";
import Register from "../src/pages/Register.jsx";
import Login from "../src/pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Admin from "./pages/admin.jsx";
import RegularUser from "./pages/regularUser.jsx";
import { ProtectedRoute, RedirectIfLoggedIn, RestrictForAdmin, RestrictForUser } from "./ProtectedRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Cart from "./pages/Cart.jsx";
import OrderSuccess from "./componets/OrderSuccess.jsx";
import AdminUsers from "./componets/AdminUsers.jsx";

export default function App() {
  return (
    <div className=" select-none">
      
      <Routes>
        <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
        <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
        <Route path='/' element={<Home />} />
        <Route path='/Profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
        <Route path='/ordersuccess' element={<ProtectedRoute><RestrictForAdmin><OrderSuccess/></RestrictForAdmin></ProtectedRoute>} />
        <Route path='/Cart' element={<ProtectedRoute><RestrictForAdmin><Cart /></RestrictForAdmin></ProtectedRoute>} />
        <Route path='/regularUser' element={<ProtectedRoute><RestrictForAdmin><RegularUser /></RestrictForAdmin></ProtectedRoute>} />
        <Route
          path='/admin'
          element={
            <ProtectedRoute >
              <RestrictForUser><Admin /></RestrictForUser>
            </ProtectedRoute>
          }
        />
        <Route
          path='/adminuser'
          element={
            <ProtectedRoute >
              <RestrictForUser><AdminUsers/></RestrictForUser>
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
}
