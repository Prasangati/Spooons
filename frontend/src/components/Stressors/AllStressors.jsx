import React, { useEffect, useState } from 'react';
import api from "../../utils/axiosConfig";
import Loading from "../../pages/Loading/Loading";
import "./AllStressors.css"

const AllStressors = () => {
  const [stressors, setStressors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStressors = async () => {
      try {
        const response = await api.get('/journal/stressors/recent/');
        setStressors(response.data);
      } catch (error) {
        console.error("Failed to fetch stressors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStressors();
  }, []);

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
              </div>
            ))
          ) : (
            <p className="no-entries">No stressors found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllStressors;
