import React from "react";
import { motion } from "framer-motion";
import "./HeroSection.css";
import { Link } from "react-router-dom";

function HeroSection() {
    return (
        <section className="hero">
            <div className="hero-container">
                {/* Left Side - Image */}
                <motion.div
                    className="hero-image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <img src="/illustration.png" alt="Illustration" />
                </motion.div>

                {/* Right Side - Text Content */}
                <motion.div
                    className="hero-text"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <h1>AI Stress Tracking Through Journal Entries</h1>
                    <p>
                        Discover insights about your mental well-being through AI-powered
                        analysis of your journal entries. Get personalized guidance and stress-tracking
                        recommendations.
                    </p>

                    {/* CTA Button */}
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <motion.button
                            className="cta-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;
