import React from "react";
import "./FilterBar.css";

const FilterBar = ({ filter, setFilter }) => {
    const filters = ["All", "Folders", "Pictures"];

    return (
        <div className="filter-bar">
            {filters.map((f) => (
                <button
                    key={f}
                    className={`filter-button ${filter === f ? "active" : ""}`}
                    onClick={() => {

                        setFilter(f)
                    }}
                >
                    {f}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
