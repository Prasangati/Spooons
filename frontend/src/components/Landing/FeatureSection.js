import React from "react";
import { motion } from "framer-motion";
import "./FeatureSection.css"


function FeatureSection() {
    return (
        <section className="feature-section">
            <motion.div
                className="feature-content"
                initial={{opacity: 0, y: 20, scale: 0.95}}
                whileInView={{opacity: 1, y: 0, scale: 1}}
                viewport={{once: true, margin: "-100px"}}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.2
                }}
            >
                <div className="heading-container">
                    <h2 className="feature-heading">With <span className="green-text"> Spoons</span> you can:
                    </h2>
                </div>

                {/* Add your feature items here */}
            </motion.div>

            <div className="features-grid">
                <motion.div
                    className="feature-box"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: "-100px"}}
                    transition={{delay: 0.4, type: "spring"}}
                >
                    <div className="feature-emoji">📔</div>
                    <h3 className="feature-title">Journal</h3>
                    <p className="feature-description">
                        Document your daily experiences and track patterns over time
                        with our intuitive journaling interface.
                    </p>
                </motion.div>

                <motion.div
                    className="feature-box"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: "-100px"}}
                    transition={{delay: 0.6, type: "spring"}}
                >
                    <div className="feature-emoji">⚠️</div>
                    <h3 className="feature-title">Track Stressors</h3>
                    <p className="feature-description">
                        Identify and monitor stress triggers with smart categorization
                        and real-time tracking features.
                    </p>
                </motion.div>

                <motion.div
                    className="feature-box"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: "-100px"}}
                    transition={{delay: 0.8, type: "spring"}}
                >
                    <div className="feature-emoji">💡</div>
                    <h3 className="feature-title">Personalized Guidance</h3>
                    <p className="feature-description">
                        Receive tailored recommendations based on your unique patterns
                        and progress.
                    </p>
                </motion.div>
            </div>

        </section>
    );
}

export default FeatureSection;