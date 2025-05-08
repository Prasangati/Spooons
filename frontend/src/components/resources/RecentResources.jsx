import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../../pages/Loading/Loading";
import BASE_URL from "../../utils/config";

const RecentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(`${BASE_URL}/journal/resources/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch recent resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="recent-entries-container">
      <h3 className="entries-title">Recent Recommendations</h3>

      {loading ? (
        <Loading />
      ) : (
        <div className="entries-list">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <div key={resource.id} className="entry-card">
                <h4>{resource.name}</h4>
                <p>{resource.description}</p>

                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  Visit Resource
                </a>

                {resource.journal_entry_date && (
                  <p className="entry-date">
                    Based on Journal Entry from:{" "}
                    {new Date(resource.journal_entry_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="no-entries">No recent resources found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentResources;

