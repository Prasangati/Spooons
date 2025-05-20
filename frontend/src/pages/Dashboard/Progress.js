// /pages/Dashboard/Progress.js
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Progress.css";

function Progress() {
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);

  // hard coded data for deployment purposes
  const heatmapData = [
    { date: "2025-05-07", count: 5 },
    { date: "2025-05-08", count: 1 },
    { date: "2025-05-09", count: 2 },
  ]

  return (
    <div className="progress-container">
      <p className="subtext">See your journaling patterns over time...</p>
      <CalendarHeatmap
        startDate={lastYear}
        endDate={today}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.count >= 3) return "color-scale-3";
          if (value.count === 2) return "color-scale-2";
          return "color-scale-1";
        }}
        showWeekdayLabels
      />
    </div>
  );
}

export default Progress;
