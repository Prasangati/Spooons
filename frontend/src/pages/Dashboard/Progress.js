import React, { useState, useEffect } from "react";
import axios from "axios";
import DiaryHeatmap from "../../components/progress/HeatMap";
import "./Progress.css";


function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:8000/journal/entries/", {
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
        console.error("Error fetching entries for progress:", error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);



  return (
    <div className="progress-container">
      <h2 className="progress-heading">Progress Tracker</h2>
      <p className="progress-subtext">See your journaling patterns over time</p>

      {loading ? (
        <p>Loading heatmap...</p>
      ) : (
        <DiaryHeatmap entries={entries} />
      )}
    </div>
  );
}

export default Progress;