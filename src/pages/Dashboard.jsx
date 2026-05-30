import { useCollection } from "../hooks/useFirestore";
import {
  Package,
  Users,
  MessageSquare,
  Image,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: products } = useCollection("products", "order");
  const { data: testimonials } = useCollection("testimonials", "order");
  const { data: partners } = useCollection("partners", "order");

  const stats = [
    {
      label: "Total Produk",
      value: products.length,
      icon: <Package size={24} />,
      color: "#2c5f4f",
      link: "/admin/products",
    },
    {
      label: "Testimonial",
      value: testimonials.length,
      icon: <MessageSquare size={24} />,
      color: "#3a8f70",
      link: "/admin/testimonials",
    },
    {
      label: "Partner Brand",
      value: partners.length,
      icon: <Users size={24} />,
      color: "#7fb5a5",
      link: "/admin/partners",
    },
  ];

  const menus = [
    { label: "Hero Section", icon: <Image size={20} />, link: "/admin/hero", desc: "Kelola gambar & tombol hero" },
    { label: "Produk", icon: <Package size={20} />, link: "/admin/products", desc: "Tambah, edit, hapus produk" },
    { label: "Intro Section", icon: <Image size={20} />, link: "/admin/intro", desc: "Kelola section perkenalan" },
    { label: "Aplikasi", icon: <Image size={20} />, link: "/admin/applications", desc: "Kelola section fasilitas" },
    { label: "Partner", icon: <Users size={20} />, link: "/admin/partners", desc: "Kelola logo partner" },
    { label: "Teknologi", icon: <TrendingUp size={20} />, link: "/admin/technology", desc: "Kelola section teknologi NCCO" },
    { label: "Keunggulan", icon: <TrendingUp size={20} />, link: "/admin/advantages", desc: "Kelola section keunggulan" },
    { label: "Testimonial", icon: <MessageSquare size={20} />, link: "/admin/testimonials", desc: "Kelola ulasan pelanggan" },
    { label: "Tentang", icon: <Image size={20} />, link: "/admin/about", desc: "Kelola section tentang RHT" },
    { label: "CTA & Footer", icon: <Settings size={20} />, link: "/admin/footer", desc: "Kelola CTA & info footer" },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Selamat datang di Super Admin Panel RHT</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <Link to={s.link} key={s.label} className="stat-card" style={{ "--accent": s.color }}>
            <div className="stat-icon" style={{ background: s.color }}>
              {s.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Menu Grid */}
      <h2 className="section-title">Kelola Konten Website</h2>
      <div className="menu-grid">
        {menus.map((m) => (
          <Link to={m.link} key={m.label} className="menu-card">
            <div className="menu-icon">{m.icon}</div>
            <div className="menu-info">
              <span className="menu-label">{m.label}</span>
              <span className="menu-desc">{m.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
