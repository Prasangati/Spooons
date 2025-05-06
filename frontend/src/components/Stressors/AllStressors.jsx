import React, { useEffect, useState } from 'react';
import api from "../../utils/axiosConfig";
import Loading from "../../pages/Loading/Loading";
import BASE_URL from "../../utils/config";


const AllStressors = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await api.get('/journal/stressors/recent/');



        setEntries(response.data);
      } catch (error) {
        console.error("Failed to fetch recent entries:", error);
      }
       finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, []);

  return (
    <div className="recent-entries-container">
      <h3 className="entries-title">Stressors</h3>

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
              </div>
            ))
          ) : (
            <p className="no-entries">No Stressors added.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllStressors;
