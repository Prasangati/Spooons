import React, { useState, useEffect } from "react";
import "./Resources.css";
// until i figure out how to fetch from backend
const dummyData = [
  { id: 1, title: "Coping with Anxiety", date: "2025-04-10" },
  { id: 2, title: "Mindful Breathing", date: "2025-04-12" },
  { id: 3, title: "Healthy Sleep Habits", date: "2025-04-14" },
];

const ResourceFilter = ({ onFilter }) => {
    const [keyword, setKeyword] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleFilter = () => {
        onFilter({ keyword, startDate, endDate });
    };

    // reset the filtering
    const handleClear = () => {
        setKeyword("");
        setStartDate("");
        setEndDate();
        onFilter({ keyword: "", startDate: "", endDate: "" });
    }

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

           <button className="apply-btn" onClick={handleFilter}>Apply Filters</button>
           <button className="clear-btn" onClick={handleClear}>Clear Filters</button>
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
            // How to connect to backend?
            setResources(dummyData);
            setFilteredResources(dummyData);
        };

        fetchResources().then(() => {});
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
            <div className = "clip"></div>
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
