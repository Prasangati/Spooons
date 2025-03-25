import React from "react";
import { motion } from "framer-motion";
import "./FeatureSection.css"


function FeatureSection() {
    return (
        <section className="feature-section">
            <motion.div
                className="feature-content"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.2
                }}
            >
                <h2 className="feature-heading">
                    <span className="green-text">Spoons</span> allows you to
                </h2>

                {/* Add your feature items here */}
            </motion.div>
        </section>
    );
}

export default FeatureSection;