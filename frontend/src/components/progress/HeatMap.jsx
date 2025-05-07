import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";


const JournalHeatmap = ({ entries }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - 7); // extra padding to ensure May shows up

console.log("Entries passed to heatmap:", entries); // making sure heatmap actually takes in entries

  // formatting
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Safely aggregate data
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

  return (
    <div className="heatmap-container">
      <p className="heatmap-range">
        Showing entries from <strong>{formatDate(startDate)}</strong> to{" "}
        <strong>{formatDate(today)}</strong>
      </p>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={finalHeatmapData}
        classForValue={(value) => {
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

