import React, { useState, useEffect } from "react";
import "./Progress.css";
import axios from "axios";
import JournalEntries from "./Journal";

function Progress() {
    return (
        <div className="progress-container">
            <p className="subtext">See your journaling patterns over time...</p>
        </div>
    );
};

export default Progress;