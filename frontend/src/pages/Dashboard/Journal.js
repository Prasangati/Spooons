import React, { useState, useEffect } from "react";
import "./Journal.css";

function JournalEntries() {
  const [title, setTitle] = useState(""); // state for entry title
  const [entries, setEntries] = useState([]); // storing journal entries
  const [newEntry, setNewEntry] = useState(""); // current input 
  const [showEntries, setShowEntries] = useState(false); //  past entries
  
  
  
  
  const quotes = [
      "Be not afraid of growing slowly, be afraid only of standing still. — Chinese Proverb",
      "The only person you are destined to become is the person you decide to be. — Ralph Waldo Emerson",
      "Do your best until you know better. Then when you know better, do better. — Maya Angelou",
      "Strive for progress, not perfection.  ― David Perlmutter",
      "Your future is hidden in your daily routine. — Mike Murdock", 
      "The difference between who you are and who you want to be is what you do.",
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Will Durant"
   ];
   const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
   useEffect(() => {
   const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 6000); // 
    return () => clearInterval(quoteInterval); // cleanupon unmount
  }, []);



  //draft
  const handleSaveDraft = () => {
    if (title.trim() === "") {
      alert("Title is required to save.");
      return;
    }
    const draftEntry = {
      id: entries.length + 1,
      title,
      text: newEntry,
      date: new Date().toLocaleString(),
      status: "Draft",
    };
    setEntries([draftEntry, ...entries]);
    setTitle("");
    setNewEntry("");
  };
//submit entry

  const handleSendEntry = () => {
    if (title.trim() === "") {
      alert("Title is required to send.");
      return;
    }
    if (newEntry.trim() === "") {
      alert("Entry cannot be empty.");
      return;
    }
    const finalEntry = {
      id: entries.length + 1,
      title,
      text: newEntry,
      date: new Date().toLocaleString(),
      status: "Sent",
    };
    setEntries([finalEntry, ...entries]);
    setTitle("");
    setNewEntry("");
  };

  const handleInputChange = (e) => {
    setNewEntry(e.target.value);
  };

  return (
    <div className="journal-container">
        <div className="quote-container">
        <p className="quote-text">{quotes[currentQuoteIndex]}</p>
      </div>
      <nav className="journal-nav">
        <button
          className={!showEntries ? "active" : ""}
          onClick={() => setShowEntries(false)}
        >
          New Entry
        </button>
        <button
          className={showEntries ? "active" : ""}
          onClick={() => setShowEntries(true)}
        >
          Past Entries
        </button>
      </nav>

      {!showEntries ? (
        <>
          <input
            type="text"
            className="title-input"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="journal-input-box">
            <textarea
              className="journal-input"
              placeholder="Write your thoughts ..."
              value={newEntry}
              onChange={handleInputChange}
            />
          </div>
          <div className="button-group">
            <button className="save-draft-btn" onClick={handleSaveDraft}>
              Save as Draft
            </button>
            <button className="send-btn" onClick={handleSendEntry}>
              Send
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="entries-title">Past Journal Entries</h3>
          <div className="entries-list">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <h4>{entry.title}</h4>
                  <span className="entry-date">
                    {entry.date} - <strong>{entry.status}</strong>
                  </span>
                  <p className="entry-text">{entry.text}</p>
                </div>
              ))
            ) : (
              <p className="no-entries">No past entries yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default JournalEntries;
