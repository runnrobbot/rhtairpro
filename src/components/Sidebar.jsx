import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Image,
  Package,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/admin" },
  { label: "Hero Section", icon: <Image size={18} />, to: "/admin/hero" },
  { label: "Produk", icon: <Package size={18} />, to: "/admin/products" },
  { label: "Intro Section", icon: <Image size={18} />, to: "/admin/intro" },
  { label: "Aplikasi", icon: <Image size={18} />, to: "/admin/applications" },
  { label: "Partner", icon: <Users size={18} />, to: "/admin/partners" },
  { label: "Teknologi", icon: <TrendingUp size={18} />, to: "/admin/technology" },
  { label: "Keunggulan", icon: <TrendingUp size={18} />, to: "/admin/advantages" },
  { label: "Testimonial", icon: <MessageSquare size={18} />, to: "/admin/testimonials" },
  { label: "Tentang", icon: <Image size={18} />, to: "/admin/about" },
  { label: "CTA & Footer", icon: <Settings size={18} />, to: "/admin/footer" },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">RHT Admin</span>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Menu navigasi admin">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight size={14} className="sidebar-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-ghost btn-full sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
