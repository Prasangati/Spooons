import React, { useState, useEffect } from "react";
import "./Journal.css";
import Loading from "../Loading.js";
import axios from "axios";
import {getCookie} from "../../utils/utils";

function JournalEntries() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(""); // state for entry title
  const [entries, setEntries] = useState([]); // storing journal entries
  const [newEntry, setNewEntry] = useState(""); // current input
  const [showNewEntryForm, setShowNewEntryForm] = useState(false); //  past entries
  const [oldEntries, setOldEntries] = useState([]);
  const csrfToken = getCookie('csrftoken');

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
    }, 6000); 
    return () => clearInterval(quoteInterval); // cleanupon unmount
  }, []);
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/journal/entries/recent/', {
          withCredentials: true,
        });
        setOldEntries(response.data);
      } catch (error) {
        console.error("Error fetching recent entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, []);


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
    resetForm();
  };
//submit - confirmation

  const handleSendEntry = async () => {
  if (title.trim() === "") {
    alert("Title is required to send.");
    return;
  }
  if (newEntry.trim() === "") {
    alert("Entry cannot be empty.");
    return;
  }

  if (!window.confirm("Are you sure you're ready to send this journal entry?")) {
    return;
  }

  setLoading(true); // show Loading component

  try {
    console.log("Sending journal entry...");
    console.log("CSRF token:", getCookie('csrftoken'));
    const response = await axios.post(
      'http://localhost:8000/journal/entries/',
      {
        title: title,
        entry: newEntry,
      },
      {
        withCredentials: true,
       headers: {
      'X-CSRFToken': csrfToken,
      }
      }
    );

    const createdEntry = response.data;


    setEntries([createdEntry, ...entries]);
    resetForm();
    alert("Entry successfully submitted!");
  } catch (error) {
    console.error("Error sending entry:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false); // hide Loading component
  }
  };




  const handleInputChange = (e) => {
    setNewEntry(e.target.value);
  };
  const resetForm = () => {
    setTitle("");
    setNewEntry("");
    setShowNewEntryForm(false);
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


      <div>
      <h3 className="entries-title">Recent Journal Entries</h3>
      </div>





      {!showNewEntryForm ? (
        <button
          className="add-entry-btn"
          onClick={() => setShowNewEntryForm(true)}
        >
          + Add New Entry
        </button>
      ) : (
        <div className="new-entry-form">
          <input
            type="text"
            className="title-input"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="journal-input"
            placeholder="A space for reflection . . ."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
<div className="button-group">
            <button className="save-draft-btn" onClick={handleSaveDraft}>
              Save as Draft
            </button>
            <button className="send-btn" onClick={handleSendEntry}>
              Send
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
