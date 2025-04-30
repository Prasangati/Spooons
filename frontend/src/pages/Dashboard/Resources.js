import React, { useState, useEffect } from "react";
import "./Resources.css";

const ResourceFilter = ({ onFilter }) => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    onFilter({ keyword, startDate, endDate });
  };

  const handleClear = () => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    onFilter({ keyword: "", startDate: "", endDate: "" });
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

      <button className="apply-btn" onClick={handleFilter}>Apply Filters</button>
      <button className="clear-btn" onClick={handleClear}>Clear Filters</button>
    </div>
  );
};

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const stored = localStorage.getItem("favoriteResources");
    return stored ? JSON.parse(stored) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(5);
  const itemsPerLoad = 3;

  useEffect(() => {
    const fetchResources = async () => {

    };
    fetchResources();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        loadMoreResources();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredResources, visibleCount]);

  const loadMoreResources = () => {
    if (visibleCount < filteredResources.length) {
      setVisibleCount(prev => prev + itemsPerLoad);
    }
  };

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
    setVisibleCount(5); // reset scroll on new filter
  };

  const toggleFavorite = (id) => {
    const button = document.getElementById(`heart-${id}`);
    if (button) {
      button.classList.add("clicked");
      setTimeout(() => button.classList.remove("clicked"), 400);
    }

    const updated = favoriteIds.includes(id)
      ? favoriteIds.filter(favId => favId !== id)
      : [...favoriteIds, id];

    setFavoriteIds(updated);
    localStorage.setItem("favoriteResources", JSON.stringify(updated));
  };

  const sortedResources = [...filteredResources].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  const baseResources = showOnlyFavorites
    ? sortedResources.filter(r => favoriteIds.includes(r.id))
    : sortedResources;

  const displayedResources = baseResources.slice(0, visibleCount);

  return (
    <div className="resources-container">
      <div className="clip"></div>
      <ResourceFilter onFilter={handleFilter} />
      <div style={{
        textAlign: "right",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <button
          className="sort-btn"
          onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
        >
          Sort: {sortOrder === "newest" ? "Newest → Oldest" : "Oldest → Newest"}
        </button>
        <label style={{ fontSize: "14px", color: "#066341" }}>
          <input
            type="checkbox"
            checked={showOnlyFavorites}
            onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
          />
          {" "}Show only favorites
        </label>
      </div>
      <div className="resources-list">
        {displayedResources.length > 0 ? (
          displayedResources.map((resource) => (
            <div key={resource.id} className="resource-item">
              <h3>{resource.title}</h3>
              <button
                id={`heart-${resource.id}`}
                className="heart-btn"
                onClick={() => toggleFavorite(resource.id)}
                title={favoriteIds.includes(resource.id) ? "Unsave" : "Save"}>
                {favoriteIds.includes(resource.id) ? "❤️" : "🤍"}
              </button>
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

