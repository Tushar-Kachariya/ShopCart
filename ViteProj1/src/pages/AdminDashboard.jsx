import { Outlet } from "react-router-dom";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import AdminSidebar from "../componets/AdminSidebar";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
