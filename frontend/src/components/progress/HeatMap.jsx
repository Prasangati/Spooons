// /components/progress/Heatmap.jsx

import React, {useState} from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./HeatMap.css"

const JournalHeatmap = ({ entries }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [entriesForDate, setEntriesForDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

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
      const format = (d) => d.toLocaleDateString("en-CA");
      const today = new Date();
      const todayStr = format(today);
      const hasTodayEntry = datesSet.has(todayStr);

      let currentStreak = 0;
      let maxStreak = 0;
      let streak = 0;
      let broken = false;

      let date = hasTodayEntry ? new Date(today) : new Date(today.setDate(today.getDate() - 1));

      for (let i = 0; i < 550; i++) {
        const dateStr = format(date);

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

        date.setDate(date.getDate() - 1);
      }

    maxStreak = Math.max(maxStreak, streak);

    return { currentStreak, maxStreak, hasTodayEntry };
}


const { currentStreak, maxStreak, hasTodayEntry } = getStreakStats(entryDates);
const showStreakReminder = !hasTodayEntry && currentStreak > 0;


// pull up a modal with archived entries when a cell is clicked

 const handleDayClick = (value) => {
    if(!value || value.count === 0) return;

    const formatted = value.date;

    const filtered = entries.filter(
      (entry) =>
        new Date(entry.created_at).toLocaleDateString("en-CA") === formatted
    );

    if (filtered.length > 0) {
      setSelectedDate(formatted);
      setEntriesForDate(filtered);
      setModalOpen(true);
      setExpandedIndex(null);
    }
 };

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

     {showStreakReminder && (
        <div className="streak-reminder">
          🔔 Don't lose your streak!{" "}
        </div>
      )}

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
        onClick={handleDayClick}
      />

         <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-square legend-empty" />
          <div className="legend-square legend-low" />
          <div className="legend-square legend-medium" />
          <div className="legend-square legend-high" />
          <span>More</span>
        </div>


          {modalOpen && (
        <div className="modal-backdrop">
          <div className="heatmap-modal">
            <h2>Entries for {selectedDate}</h2>

            {entriesForDate.map((entry, index) => (
              <div key={index} className="entry-preview">
                <div
                  className="accordion-header"
                  onClick={() =>
                    setExpandedIndex(index === expandedIndex ? null : index)
                  }
                >
                  <h3>{entry.title}</h3>
                  <span className="accordion-toggle">
                    {index === expandedIndex ? "−" : "+"}
                  </span>
                </div>

                {index === expandedIndex && (
                  <div className="accordion-body">
                    <p>{entry.entry.slice(0, 200)}...</p>
                    {entry.tags?.length > 0 && (
                      <p>
                        <strong>🏷️ Tags:</strong> {entry.tags.join(", ")}
                      </p>
                    )}
                  </div>
                )}
                <hr />
              </div>
            ))}

            <div className="modal-footer">
              <button onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalHeatmap;


