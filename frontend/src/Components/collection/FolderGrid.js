import React from "react";
import Folder from "./Folder";
import "./FolderGrid.css";

const FolderGrid = ({ folders }) => {
    return (
        <div className="folder-grid">
            {folders.map((folder) => (
                <Folder key={folder.id} folder={folder} />
            ))}
        </div>
    );
};

export default FolderGrid;
