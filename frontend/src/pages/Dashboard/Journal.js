import React, { useState, useEffect } from "react";
import "./Journal.css";
import axios from "axios";
import {getCookie} from "../../utils/utils";
import RecentEntries from "../../components/journals/RecentEntries";

function JournalEntries() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(""); // state for entry title
  const [entries, setEntries] = useState([]); // storing journal entries
  const [newEntry, setNewEntry] = useState(""); // current input


  const [tagInput, setTagInput] = useState("");    // #tag
  const [tags, setTags]  = useState([]);    
  const [showTagInput, setShowTagInput] = useState(false); 


  const [showNewEntryForm, setShowNewEntryForm] = useState(false); //  past entries
  const csrfToken = getCookie('csrftoken');

  const quotes = [
      "Be not afraid of growing slowly, be afraid only of standing still. — Chinese Proverb",
      "Do your best until you know better. Then when you know better, do better. — Maya Angelou",
      "Strive for progress, not perfection.  ― David Perlmutter",
      "Your future is hidden in your daily routine. — Mike Murdock", 
      "The difference between who you are and who you want to be is what you do.",
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Will Durant"
   ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((i) => (i + 1) % quotes.length);
    }, 6000); 
    return () => clearInterval(quoteInterval); // cleanupon unmount
  }, [quotes.length]);


  const resetForm = () => {
    setTitle("");
    setNewEntry("");
    setTagInput("");             
    setTags([]);                 
    setShowTagInput(false);      
    setShowNewEntryForm(false);
  };

  const handleAddTag = () => {
    const raw = tagInput.trim().replace(/^#/, "");
    if (raw && !tags.includes(raw)) {
      setTags([raw, ...tags]);
    }
    setTagInput("");
    setShowTagInput(false);
  };


  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const MAX_ENTRY_LENGTH = 500;// chr  limit

  //temp - will update this functionality  
  const prompts = [
    "What are you grateful for today?",
    "What’s something that challenged you recently, and how did you handle it?",
    "What does your ideal day look like?",
    "Write a letter to your future self.",
    "Describe a recent moment that brought you joy.",
    "What’s something you’re currently learning about yourself?",
    "What emotions have you been feeling the most lately?",
    "If today was your last day, what would you want to remember?",
  ];
  const [currentPrompt, setCurrentPrompt] = useState("");
  useEffect(() => {
    const stored = localStorage.getItem("journalPrompt");
    const lastUpdate = localStorage.getItem("promptTimestamp");
    const now = Date.now();
  
    // 12 hours = 43,200,000 milliseconds
    if (!stored || !lastUpdate || now - lastUpdate > 43200000) {
      const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(newPrompt);
      localStorage.setItem("journalPrompt", newPrompt);
      localStorage.setItem("promptTimestamp", now.toString());
    } else {
      setCurrentPrompt(stored);
    }
  }, []);
  
// add new entry

  const handleSendEntry = async () => {
    if (!title.trim()) return alert("Title is required.");
    if (!newEntry.trim()) return alert("Entry cannot be empty.");

  setLoading(true); // show Loading component

  try {
    console.log("CSRF token:", getCookie('csrftoken'));
    const response = await axios.post(
      'http://localhost:8000/journal/entries/',
      {
        title: title,
        entry: newEntry,
        tags,
      },
      {
        withCredentials: true,
       headers: {'X-CSRFToken': csrfToken,}
      }
    );
    const createdEntry = response.data;
    setEntries([createdEntry, ...entries]);
    resetForm();
  } catch (error) {
    console.error("Error sending entry:", error);
    alert("Something went wrong. Please try again.");
  } finally { setLoading(false); }
  };


  return (
    <div className="journal-container">
      {!showNewEntryForm ? (
        <div className="quote-container floating-quote">
          <p className="quote-text">{quotes[currentQuoteIndex]}</p>
        </div>
      ) : (
      <div className="prompt-container floating-quote">
        <p className="quote-text">{currentPrompt}</p>
      </div>
       )}



      {!showNewEntryForm ? (

          <>
            <RecentEntries entries={entries}/>
            <button
                className="add-entry-btn"
                onClick={() => setShowNewEntryForm(true)}
            >
 <i className="fa-solid fa-file-circle-plus"></i>
</button>
</>

      ) : (
          <div className="new-entry">
          <div className={`title-with-tag ${showTagInput ? "adding" : ""}`}>
          <input
                type="text"
                className="title-input"
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
          />
          <button
              type="button"
              className="add-tag-btn"       
              onClick={() => setShowTagInput(true)}
            > 
              <i className="fa-solid fa-hashtag"></i>

             </button>
          
          {showTagInput && (
              <input
                type="text"
                className="tag-input-mini"  
                placeholder="tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown} 
                onBlur={() => setShowTagInput(false)} 
                autoFocus
              />
            )}
          </div>

 
          <div className="tag-list">
            {tags.map((t) => (
              <span key={t} className="tag-chip">
                #{t}
                <button
                  type="button"
                  className="remove-btn"
                  aria-label={`Remove ${t}`}
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="entry-box-wrapper">

          <textarea
            className="journal-input"
            placeholder="A space for reflection . . ."
            value={newEntry}
            onChange={(e) => {
              if (e.target.value.length <= MAX_ENTRY_LENGTH) {
              setNewEntry(e.target.value);
            }
          }}
          />
            <div className="char-counter-inside">
            {MAX_ENTRY_LENGTH - newEntry.length}
          </div>
          </div>

    <div className="button-group">
            <button className="send-btn" onClick={handleSendEntry}>
            {loading ? "Adding…" : "Add"}
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowNewEntryForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JournalEntries;
