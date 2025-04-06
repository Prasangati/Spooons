// components/RecentEntries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {getCookie} from "../../utils/utils";
import Loading from "../../pages/Loading";

const RecentEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [entryBeingEdited, setEntryBeingEdited] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedText, setEditedText] = useState("");

  
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

  const handleConfirmDelete = async (entry_number) => {

    try {
      const csrfToken = getCookie("csrftoken");
      await axios.delete(`http://localhost:8000/journal/entries/${entry_number}/`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });
  
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.entry_number !== entry_number));
      setShowDeleteModal(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Could not delete entry.");
      setShowDeleteModal(false);
    }
  };
  
  const handleEditClick = (entry) => {
    setEntryBeingEdited(entry); 
    setEditedTitle(entry.title);
    setEditedText(entry.entry);
    setEditModalOpen(true);   
  };

  const handleSaveEdit = async () => {
    if (!entryBeingEdited) return;

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await axios.put(
        `http://localhost:8000/journal/entries/${entryBeingEdited.entry_number}/`,
        {
          title: editedTitle,
          entry: editedText,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setEntries((prev) =>
        prev.map((e) => (e.entry_number === entryBeingEdited.entry_number ? response.data : e))
      );
      setEditModalOpen(false);
      setEntryBeingEdited(null);
      setEditedTitle("");
      setEditedText("");

    } catch (error) {
      console.error("Error saving edited entry:", error);
      alert("Could not update entry.");
    } finally {
      setLoading(false); }
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
              key={entry.entry_number}
         className="entry-card">
              <h4>{entry.title}</h4>
              <span className="entry-date">
                {new Date(entry.created_at).toLocaleString()}
              </span>
              <p className="entry-text">{entry.entry}</p>
              <div className="entry-icons">
                          <button
              className="icon-btn"
              onClick={() => handleEditClick(entry)}
              title="Edit"
            >
              ✏️
            </button>


            <button
  className="icon-btn"
  onClick={() => {
    setShowDeleteModal(true);
    setEntryToDelete(entry); 
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

{showDeleteModal && entryToDelete && (
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
  onClick={() => handleConfirmDelete(entryToDelete?.entry_number)}
>
  Yes, Delete
</button>

            </div>
          </div>
    </div>

)}

{editModalOpen && entryBeingEdited && (
        <div className="modal-overlay">
        <div className="modal-box edit-modal">
            <h4>Edit Entry</h4>
            <input
              type="text"
              className="title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="journal-input"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setEditModalOpen(false)}>
                Cancel
              </button>
              <button className="send-btn" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}


</div>
  );
};

export default RecentEntries;
