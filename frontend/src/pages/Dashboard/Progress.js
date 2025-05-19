// /pages/Dashboard/Progress.js
import React, { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import JournalHeatMap from "../../components/progress/HeatMap";
import "./Progress.css";

function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await api.get("/journal/entries/", {
          withCredentials: true,
        });

        const data = response.data;
        if (Array.isArray(data)) {
          setEntries(data);
        } else if (data.entries && Array.isArray(data.entries)) {
          setEntries(data.entries);
        } else {
          console.error("Unexpected API response shape:", data);
          setEntries([]);
        }
      } catch (error) {
        console.error("Failed to fetch entries for progress tracker:", error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="progress-container">
      <p className="subtext">See your journaling patterns over time</p>
      {loading ? <p>Loading heatmap...</p> : <JournalHeatMap entries={entries} />}
    </div>
  );
}

export default Progress;
