import React, { useState } from "react";
import FilterBar from "../Collection/FilterBar";
import FolderGrid from "../Collection/FilterBar";
import ImageGrid from "../Collection/FilterBar";
import "./Collections.css";

const Collections = (folders, images) => {
    const [filter, setFilter] = useState("All");
    // Mock Data
    // const folders = [
    //     { id: 1, name: "Vacation", images: ["img1.jpg", "img2.jpg"] },
    //     { id: 2, name: "Work", images: ["img3.jpg", "img4.jpg"] },
    // ];

    // const images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];

    return (
        <div className="collectionBox">
            <FilterBar filter={filter} setFilter={setFilter} />
            <div className="content">
                {filter === "All" || filter === "Folders" ? (
                    <FolderGrid folders={folders} />
                ) : null}
                {filter === "All" || filter === "Pictures" ? (
                    <ImageGrid images={images} />
                ) : null}
            </div>
        </div>
    );
};

export default Collections;
