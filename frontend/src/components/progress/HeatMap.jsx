// /components/progress/Heatmap.jsx
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./HeatMap.css"

const JournalHeatmap = ({ entries }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - 7);

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

  // streak calculation

  const entryDates = new Set(
      entries.map(entry =>
        new Date(entry.created_at).toLocaleDateString("en-CA") // "YYYY-MM-DD"
      )
   );

  function getStreakStats(datesSet) {
  let today = new Date();

  let currentStreak = 0;
  let maxStreak = 0;
  let streak = 0;
  let broken = false;

  for (let i = 0; i < 550; i++) {
    const dateStr = today.toLocaleDateString("en-CA");

    if (datesSet.has(dateStr)) {
      streak++;

      if (!broken) {
        currentStreak++;
      }
    } else {
      if (!broken) {
        broken = true;
      }

      maxStreak = Math.max(maxStreak, streak);
      streak = 0;
    }

    today.setDate(today.getDate() - 1);
  }

  maxStreak = Math.max(maxStreak, streak);

  return { currentStreak, maxStreak };
}


const { currentStreak, maxStreak } = getStreakStats(entryDates);

  return (
    <div className="heatmap-container">

        <p className="entry-count">
        You’ve written <strong>{entries.length}</strong> journal entr{entries.length === 1 ? "y" : "ies"}!
        </p>

        <p className="streak-text">
          🔥 Current Streak: <strong>{currentStreak}</strong> day{currentStreak !== 1 ? "s" : ""}
          <br />
          🏆 Longest Streak: <strong>{maxStreak}</strong> day{maxStreak !== 1 ? "s" : ""}
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
        horizontal={true}
        gutterSize={2}
        weekdayLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
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


