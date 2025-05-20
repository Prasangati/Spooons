import React, { useState, useEffect } from "react";
import "./Resources.css";
import RecentResources from "../../components/resources/RecentResources";
import axios from "axios";
import BASE_URL from "../../utils/config";

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

      <button className="apply-filter-btn" onClick={handleFilter}>
  Apply Filters
</button>
    </div>
  );
};

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
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
        setFilteredResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleFilter = ({ keyword, startDate, endDate }) => {
    let filtered = resources;

    if (keyword) {
      filtered = filtered.filter((res) =>
        res.name.toLowerCase().includes(keyword.toLowerCase()) ||
        res.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter((res) => {
        const entryDate = new Date(res.journal_entry_date).toISOString().split("T")[0];
        return entryDate >= startDate;
      });
    }
    
    if (endDate) {
      filtered = filtered.filter((res) => {
        const entryDate = new Date(res.journal_entry_date).toISOString().split("T")[0];
        return entryDate <= endDate;
      });
    }
    

    setFilteredResources(filtered);
  };

  return (
    <div className="resources-container">
      <h2>Resources Page</h2>
      <ResourceFilter onFilter={handleFilter} />
      <RecentResources resources={filteredResources} loading={loading} />
    </div>
  );
}

export default Resources;
