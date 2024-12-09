import React from "react";
import "./FilterBar.css";

const FilterBar = ({ filter, setFilter, handleCreateFolder, handleAddImage }) => {
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
            <div className="action-buttons">
                <button className="btn create-folder" onClick={handleCreateFolder}>+ Create Folder</button>
                <button className="btn add-image" onClick={handleAddImage}>+ Add Image</button>
            </div>
        </div>
    );
};

export default FilterBar;
