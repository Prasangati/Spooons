import React, { useEffect, useState } from 'react';
import api from "../../utils/axiosConfig";
import Loading from "../../pages/Loading/Loading";
import "./AllStressors.css"

const AllStressors = () => {
  const [stressors, setStressors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stressorToDelete, setStressorToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchStressors = async () => {
      try {
        const response = await api.get('/journal/stressors/recent/');
        setStressors(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch stressors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStressors();
  }, []);

  const handleConfirmDelete = async (id) => {
    console.log("entryId passed to delete:", id);
    if (!id) return alert("No entry ID found!");

    try {

      await api.delete(`/journal/stressors/${id}/`);


      setStressors((prevStressors) =>
      prevStressors.filter((stressors) => stressors.id !== id)
      );
      setShowDeleteModal(false);
      setStressorToDelete(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Could not delete entry.");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="recent-entries-container">
      <h3 className="entries-title">Stressors</h3>

      {loading ? (
        <Loading />
      ) : (
        <div className="entries-list">
          {stressors.length > 0 ? (
            stressors.map((item) => (
                <div key={item.id} className="entry-card">
                  <h4 className="stressor-title">{item.title}</h4>
                  <p className="entry-description">Description: {item.description}</p>
                  <div className="icon-with-label my-2">
                    <button
                        className="icon-btn delete"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setStressorToDelete(item);
                        }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <span className="icon-label">Delete</span>
                  </div>
                </div>
            ))
          ) : (
              <p className="no-entries">No stressors found.</p>
          )}
        </div>
      )}
      {showDeleteModal && stressorToDelete && (
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
                      onClick={() => handleConfirmDelete(stressorToDelete?.id)}
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

export default AllStressors;
