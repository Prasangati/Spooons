// components/RecentEntries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {getCookie} from "../../utils/utils";
import Loading from "../../pages/Loading";

const RecentEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/journal/entries/recent/', {
          withCredentials: true,
        });
        setEntries(response.data);
      } catch (error) {
        console.error('Failed to fetch recent entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
  
    try {
      const csrfToken = getCookie("csrftoken");
      await axios.delete(`http://localhost:8000/journal/entries/${id}/`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });
  
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Could not delete entry.");
    }
  };
  


  return (
    <div className="recent-entries-container">
      <h3 className="entries-title">Recent Journal Entries</h3>

      {loading ? (
        <Loading />
      ) : (
        <div className="entries-list">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <h4>{entry.title}</h4>
                <span className="entry-date">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
                <p className="entry-text">{entry.entry}</p>

                <div className="entry-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-entries">No recent entries found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentEntries;
