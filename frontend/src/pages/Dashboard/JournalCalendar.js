import React, { useState } from React;
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'
import './JournalCalendar.css'

function JournalCalendar({ journalEntries, onSelectEntry }) {

    const getEntryForDate = (date) => {
        const iso = date.toISOString().split("T")["0"];
        return journalEntries.find(entry =>
            new Date(entry.date).toISOString().split("T")[0] === iso
        );
    };

    const handleDateClick = (date) => {
        const entry = getEntryForDate(date);
        if (entry && onSelectEntry) {
            onSelectEntry(entry);
        }
    };

    const tile = ({ date }) => {
        const iso = date.toISOString().split("T")["0"];
        const hasEntry = journalEntries.some(entry =>
            new Date(entry.date).toISOString().split("T")[0] === iso
        );
        return hasEntry ? "has-entry" : null;
    };

    return (
        <div className = "calendar-wrapper">
            <Calendar
                onClickDay={handleDateClick}
                tileClassName={tileClassName}
            />
        </div>
    );
}