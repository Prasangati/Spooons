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
    if (!entry.date) return acc;
    const parsedDate = new Date(entry.date);
    if (isNaN(parsedDate.getTime())) return acc;

    const date = parsedDate.toISOString().split("T")[0];
    acc[date] = acc[date]
      ? { date, count: acc[date].count + 1 }
      : { date, count: 1 };

    return acc;
  }, {});

  const finalHeatmapData = Object.values(aggregatedData);
  console.log("Final heatmap data:", finalHeatmapData);

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
    </div>
  );
};

export default JournalHeatmap;


