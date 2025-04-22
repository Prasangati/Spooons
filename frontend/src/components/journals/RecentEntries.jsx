// components/RecentEntries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../../pages/Loading/Loading";
import BASE_URL from "../../utils/config";


const RecentEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(`${BASE_URL}/journal/entries/recent/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

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
