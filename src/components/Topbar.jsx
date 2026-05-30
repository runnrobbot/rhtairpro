import { Menu, ExternalLink } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <button
        className="topbar-menu-btn"
        onClick={onMenuClick}
        aria-label="Buka menu"
      >
        <Menu size={22} />
      </button>

      <div className="topbar-title">
        <span>RHT Super Admin</span>
      </div>

      <div className="topbar-right">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
          title="Lihat website"
        >
          <ExternalLink size={16} />
          <span className="hide-mobile">Website</span>
        </a>
        <div className="topbar-user" title={user?.email}>
          <div className="user-avatar">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
