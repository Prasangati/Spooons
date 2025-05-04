import React, { useContext, useState } from "react";
import { JournalContext } from "../context/JournalContext";
import JournalCalendar from "../components/JournalCalendar"; // adjust path if needed
import "./Progress.css";

function Progress() {
  const { journalEntries } = useContext(JournalContext);
  const [selectedEntry, setSelectedEntry] = useState(null);

  return (
    <div className="progress-container">
      <h2>Your Progress 📈</h2>

      <div className="calendar-section">
        <JournalCalendar
          journalEntries={journalEntries}
          onSelectEntry={(entry) => setSelectedEntry(entry)}
        />
      </div>

      {selectedEntry && (
        <div className="calendar-preview">
          <h4>{selectedEntry.title}</h4>
          <span className="entry-date">{selectedEntry.date}</span>
          <p className="entry-text">{selectedEntry.text}</p>
        </div>
      )}
    </div>
  );
}

export default Progress;
