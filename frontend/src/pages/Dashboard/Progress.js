// pages/Dashboard/Progress.js
import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import 'react-calendar-heatmap/dist/styles.css';
import JournalHeatmap from "../../components/progress/HeatMap";
import "./Progress.css";

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get(`/journal/entries/`, );
        console.error("Fetches:", res.data);
        setEntries(res.data);
      } catch (err) {
        console.error("Failed to fetch journal entries:", err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="progress-container">
        <p>Loading entries…</p>
      </div>
    );
  }

  // build a map of date → count (in case you have multiple entries per day)
  const countByDate = entries.reduce((acc, e) => {
    const day = new Date(e.created_at).toISOString().split("T")[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  // generate the values array for the heatmap
  const values = [];
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.toISOString().split("T")[0];
    values.push({
      date: day,
      count: countByDate[day] || 0,
    });
  }

  // optional: classForValue to shade squares by count
  const classForValue = (value) => {
    if (!value || value.count === 0) return "color-empty";
    if (value.count < 3) return "color-scale-1";
    if (value.count < 6) return "color-scale-2";
    if (value.count < 10) return "color-scale-3";
    return "color-scale-4";
  };

  return (
    <div className="progress-container">
      <h2>My Journal Heatmap</h2>
      <JournalHeatmap entries={entries}/>
    </div>
  );
}


