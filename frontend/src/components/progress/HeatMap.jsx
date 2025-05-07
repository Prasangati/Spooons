import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const JournalHeatMap = ( {entries} ) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

const aggregatedData = entries.reduce((acc, entry) => {
  if (!entry.date) return acc; // Skip if date is missing

  const parsedDate = new Date(entry.date);
  if (isNaN(parsedDate.getTime())) return acc; // Skip if date is invalid

  const date = parsedDate.toISOString().split("T")[0];

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
          if (!value) return "color-empty";
          if (value.count >= 5) return "color-high";
          if (value.count >= 3) return "color-medium";
          return "color-low";
        }}
        tooltipDataAttrs={(value) => ({
          "data-tip": `${value.date}: ${value.count} entr${value.count === 1 ? "y" : "ies"}`,
        })}
        showWeekdayLabels
      />
      </div>
  );
};

export default JournalHeatMap
