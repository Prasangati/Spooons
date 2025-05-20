import React from 'react';

const RecentResources = ({ resources, loading }) => {
  return (
    <div className="resource-section">
    <h3 className="entries-title">Recent Recommendations</h3>
    <div className="entries-list">

      {loading ? (
        <p>Loading...</p>
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
    </div>
  );
};

export default RecentResources;
