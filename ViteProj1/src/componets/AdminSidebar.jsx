import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ArrowDownUp,
  Menu,
} from "lucide-react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-slate-700 text-slate-200"
    }`;

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} bg-slate-900 p-4 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-8">
        {open && (
          <h2 className="text-xl font-bold text-white">
            Admin Panel
          </h2>
        )}
        <Menu
          size={22}
          className="cursor-pointer m-3 text-white"
          onClick={() => setOpen(!open)}
        />
      </div>

      <ul className="space-y-4">

        <NavLink to="/admin" end className={linkStyle}>
          <LayoutDashboard size={20} />
          {open && <span>All Products</span>}
        </NavLink>

        <NavLink to="/admin/add" className={linkStyle}>
          <PlusCircle size={20} />
          {open && <span>Add Product</span>}
        </NavLink>

        <NavLink to="/admin/users" className={linkStyle}>
          <Users size={20} />
          {open && <span>Users</span>}
        </NavLink>

        <NavLink to="/admin/orders" className={linkStyle}>
          <ArrowDownUp size={20} />
          {open && <span>Orders</span>}
        </NavLink>

      </ul>
    </aside>
  );
}
