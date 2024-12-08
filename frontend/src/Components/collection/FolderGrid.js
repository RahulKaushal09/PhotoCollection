import React from "react";
import Folder from "./Folder";
import "./FolderGrid.css";
import { useNavigate } from "react-router-dom";
const FolderGrid = ({ folders }) => {
    const navigate = useNavigate();
    const handleFolderClick = (folder) => {
        navigate(`/collections/${folder.id}/${folder.name}`);
    };
    return (
        <div className="folder-grid">
            {folders.map((folder) => (
                <Folder key={folder.id} folder={folder} onClick={(folder) => handleFolderClick(folder)} />
            ))}
        </div>
    );
};

export default FolderGrid;
