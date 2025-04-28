import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Optimized scroll handler
    const handleScroll = useCallback(() => {
        const scrolled = window.scrollY > 50;
        if (scrolled !== isScrolled) {
            setIsScrolled(scrolled);
        }
    }, [isScrolled]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]); // ✅ Only re-runs when `handleScroll` changes

    return (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="navbar-container">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="Logo" />
                </Link>
                <Link to="/login" className="sign-in-btn">
                    Log In
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
