import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <strong>{user?.name || "User"}</strong>
            <span>{user?.email || "user@email.com"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;