import React {useState, useEffect} from 'react';
import "./Resources.css"

function Resources() {

    return (
        <div className="resources-container">
            <div className="filter">
                <div>
                    <label>Search by keyword: </label>
                    <input
                        type="text"
                        placeholder="Search for a keyword"
                    />
                </div>

                <div>
                    <label>Start Date: </label>
                    <input
                        type="date"
                    />
                  <label>End Date: </label>
                  <input
                    type="date"
                  />
                </div>
            </div>
        </div>
    )
}

export default Resources;