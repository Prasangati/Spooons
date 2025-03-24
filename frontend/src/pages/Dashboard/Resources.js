import React, { useState, useEffect } from "react";
import "./Resources.css";

const ResourceFilter = ({ onFilter }) => {
    const [keyword, setKeyword] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleFilter = () => {
        onFilter({ keyword, startDate, endDate });
    };

    return (
        <div className="filter">
            <div>
                <label>Search by keyword: </label>
                <input
                    type="text"
                    placeholder="Search for a keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            <div>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <button onClick={handleFilter}>Apply Filters</button>
        </div>
    );
};

function Resources() {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);

    useEffect(() => {
        // Fetch resources from API or data source
        const fetchResources = async () => {
            // Replace with real API call if needed
            const data = [
                { id: 1, title: "Mental Health Guide", date: "2025-03-20" },
                { id: 2, title: "Stress Management", date: "2025-03-18" },
                { id: 3, title: "Anxiety Coping Tips", date: "2025-03-22" }
            ];
            setResources(data);
            setFilteredResources(data);
        };

        fetchResources();
    }, []);

    const handleFilter = ({ keyword, startDate, endDate }) => {
        let filtered = resources;

        if (keyword) {
            filtered = filtered.filter((res) =>
                res.title.toLowerCase().includes(keyword.toLowerCase())
            );
        }

        if (startDate) {
            filtered = filtered.filter((res) => res.date >= startDate);
        }

        if (endDate) {
            filtered = filtered.filter((res) => res.date <= endDate);
        }

        setFilteredResources(filtered);
    };

    return (
        <div className="resources-container">
            <ResourceFilter onFilter={handleFilter} />
            <div className="resources-list">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <div key={resource.id} className="resource-item">
                            <h3>{resource.title}</h3>
                            <p>Date: {resource.date}</p>
                        </div>
                    ))
                ) : (
                    <p>No resources found.</p>
                )}
            </div>
        </div>
    );
}

export default Resources;
