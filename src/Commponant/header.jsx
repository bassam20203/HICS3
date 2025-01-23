import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import logo from "./2.png";
import { Link } from "react-router-dom";

export default function Header({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="شعار المعهد" />
          </div>

          {!isLoggedIn && (
            <>
              <div className="di">
                <h1 className="h-title">المعهد العالي للعلوم التجارية</h1>
                <h1 className="h-title" style={{ color: "#f1bb1c" }}>
                  بالمحلة الكبري
                </h1>
              </div>
            </>
          )}

          {/* Hamburger menu for mobile devices */}
          <div className="hamburger-menu" onClick={toggleMenu}>
            ☰
          </div>

          <div
            ref={menuRef}
            className={`header-buttons ${isMenuOpen ? "active" : ""}`}
          >
            {isLoggedIn && (
              <>
                <Link to="/" className="header-button" onClick={toggleMenu}>
                  الصفحة الرئيسية
                </Link>

                <Link to="/homejson" className="header-button" onClick={toggleMenu}>
                  تعديل البيانات
                </Link>

                <Link to="/upload" className="header-button" onClick={toggleMenu}>
                  رفع الملفات
                </Link>

                <Link to="https://h-i-c-s-m.blogspot.com/" className="header-button" onClick={toggleMenu}>
                  المنصة التعليمية
                </Link>

                <button
                  className="header-button logout-button"
                  onClick={() => {
                    onLogout();
                    toggleMenu();
                  }}
                >
                  تسجيل الخروج
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}