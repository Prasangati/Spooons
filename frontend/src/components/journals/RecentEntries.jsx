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
  const [expandedCardId, setExpandedCardId] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null); 
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleAddTag = () => {
    const raw = tagInput.trim().replace(/^#/, "");
    if (raw && !entryBeingEdited?.tags?.includes(raw)) {
      setEntryBeingEdited({
        ...entryBeingEdited,
        tags: [raw, ...(entryBeingEdited?.tags || [])]
      });
    }
    setTagInput("");
    setShowTagInput(false);
  };
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
    setLoading(true);

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await axios.put(
        `http://localhost:8000/journal/entries/${entryBeingEdited.entry_number}/`,
        {
          title: editedTitle,
          entry: editedText,
          tags: entryBeingEdited.tags || [],
        },
        {
          withCredentials: true,
          headers: { "X-CSRFToken": csrfToken},
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

  const filteredEntries = selectedTag
    ? entries.filter((entry) => entry.tags?.includes(selectedTag))
    : entries;

  return (
    <div className="recent-entries-container">
      <h3 className="entries-title">Recent Journal Entries</h3>
      {selectedTag && (
  <>
    <p style={{ marginBottom: "1rem", color: "#066341" }}>
      Filtering by <strong>#{selectedTag}</strong>
    </p>
    <button className="clear-tag-btn" onClick={() => setSelectedTag(null)}>
      Show all entries
    </button>
  </>
)}

{loading ? (
  <Loading />
) : (
  <div className="entries-list">
    {filteredEntries.length > 0 ? (
      filteredEntries.map((entry) => (
        <div
          key={entry.entry_number}
          className={`entry-card ${expandedCardId === entry.entry_number ? "expanded" : ""}`}
          onClick={() =>
            setExpandedCardId(
              expandedCardId === entry.entry_number ? null : entry.entry_number
            )
          }
        >
          <h4>{entry.title}</h4>
          <span className="entry-date">
            {new Date(entry.created_at).toLocaleString()}
          </span>

          {entry.tags?.length > 0 && (
            <div className="tag-list">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="tag-chip"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTag(t);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <p className="entry-text">
            {expandedCardId === entry.entry_number
              ? entry.entry
              : entry.entry.slice(0, 100) + (entry.entry.length > 100 ? "..." : "")}
          </p>

          <div className="entry-icons">
            <div className="icon-with-label">
              <button
                className="icon-btn"
                onClick={() => handleEditClick(entry)}
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
              <span className="icon-label">Edit</span>
            </div>

            <div className="icon-with-label">
              <button
                className="icon-btn delete"
                onClick={() => {
                  setShowDeleteModal(true);
                  setEntryToDelete(entry);
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <span className="icon-label">Delete</span>
            </div>
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
            <div className={`title-with-tag ${showTagInput ? "adding" : ""}`}>
        <input
          type="text"
          className="title-input"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title *"
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
      {entryBeingEdited.tags?.length > 0 && (
    <div className="tag-list">
      {entryBeingEdited.tags.map((t) => (
        <span key={t} className="tag-chip">
          #{t}
          <button
            type="button"
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              setEntryBeingEdited({
                ...entryBeingEdited,
                tags: entryBeingEdited.tags.filter((x) => x !== t)
              });
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>

      )}

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
              {loading ? "Saving..." : "Save"}

              </button>
            </div>
          </div>
        </div>
      )}


</div>
  );
};

export default RecentEntries;
