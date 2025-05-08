// /components/progress/JournalHeatmap.jsx
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./HeatMap.css"

const JournalHeatmap = ({ entries }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - 7);

  console.log("Entries passed to heatmap:", entries);

  const aggregatedData = entries.reduce((acc, entry) => {
    if (!entry.created_at) return acc;
    const parsedDate = new Date(entry.created_at);
    if (isNaN(parsedDate.getTime())) return acc;

    const date = parsedDate.toLocaleDateString("en-CA");
    acc[date] = acc[date]
      ? { date, count: acc[date].count + 1 }
      : { date, count: 1 };

    return acc;
  }, {});

  const finalHeatmapData = Object.values(aggregatedData);

  return (
    <div className="heatmap-container">
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={finalHeatmapData}
        classForValue={(value) => {
          console.log("Heatmap cell value:", value);
          if (!value || !value.count) return "color-empty";
          if (value.count >= 5) return "color-high";
          if (value.count >= 3) return "color-medium";
          return "color-low";
        }}
        tooltipDataAttrs={(value) => ({
          "data-tip": value?.date
            ? `${value.date}: ${value.count || 0} entr${value.count === 1 ? "y" : "ies"}`
            : "No entry",
        })}
        showWeekdayLabels
      />

         <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-square legend-empty" />
          <div className="legend-square legend-low" />
          <div className="legend-square legend-medium" />
          <div className="legend-square legend-high" />
          <span>More</span>
        </div>

    </div>
  );
};

export default JournalHeatmap;


