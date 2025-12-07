import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌾</span>
          <span className="logo-text">
            <span className="logo-colored">Secrizz</span> Valley
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <div className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          <div className="navbar-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#community" className="nav-link">
              Community
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="navbar-auth">
            <Button to="/login" variant="secondary" size="sm">
              Login
            </Button>
            <Button to="/register" variant="primary" size="sm">
              Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
