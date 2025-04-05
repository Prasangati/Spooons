// components/RecentEntries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {getCookie} from "../../utils/utils";
import Loading from "../../pages/Loading";

const RecentEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleExpand = (id) => {
  setExpandedEntryId(expandedEntryId === id ? null : id);};

  
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


  const handleConfirmDelete = async (id) => {
    try {
      const csrfToken = getCookie("csrftoken");
      await axios.delete(`http://localhost:8000/journal/entries/${id}/`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });
  
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
      setShowDeleteModal(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Could not delete entry.");
      setShowDeleteModal(false);
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
              <div
              key={entry.id}
              className={`entry-card ${
                expandedEntryId === entry.id ? "expanded" : ""
              }`}
            >
              <h4>{entry.title}</h4>
              <span className="entry-date">
                {new Date(entry.created_at).toLocaleString()}
              </span>
              <p className="entry-text">{entry.entry}</p>
          
              <div className="entry-icons">
                <button
                  className="icon-btn"
                  onClick={() => console.log("Edit", entry.id)} // replace with modal later
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setEntryToDelete(entry);
                    setShowDeleteModal(true);
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            ))
          ) : (
            <p className="no-entries">No recent entries found.</p>
          )}
        </div>
      )}

{showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this entry?</p>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={() => handleConfirmDelete(entryToDelete.id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
    </div>

)}
</div>
  );
};

export default RecentEntries;
