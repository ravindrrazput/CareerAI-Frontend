import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  FilePenLine,
  Target,
  Settings,
  LogOut,
  Briefcase,
  History,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "Resume Analyzer",
      path: "/resume-analyzer",
      icon: <FileText size={19} />,
    },
    {
      name: "Resume History",
      path: "/resume-history",
      icon: <History size={19} />,
    },
    {
      name: "JD Matcher",
      path: "/jd-matcher",
      icon: <Briefcase size={19} />,
    },
    {
      name: "ATS Checker",
      path: "/ats-checker",
      icon: <ScanSearch size={19} />,
    },
    {
      name: "Resume Builder",
      path: "/resume-builder",
      icon: <FilePenLine size={19} />,
    },
    {
      name: "Skill Gap",
      path: "/skill-gap",
      icon: <Target size={19} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={19} />,
    },
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    closeMobileMenu();
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={21} />
      </button>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* LOGO */}
        <button
          type="button"
          className="sidebar-logo"
          onClick={handleLogoClick}
          aria-label="Go to Carrerix AI home"
        >
          <div className="logo-icon">C</div>

          <span>
            <strong>Carrerix AI</strong>
            <small>Craft Your Resume. Elevate Your Career.</small>
          </span>
        </button>

        {/* MOBILE CLOSE BUTTON */}
        <button
          className="mobile-sidebar-close"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        >
          <X size={19} />
        </button>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;