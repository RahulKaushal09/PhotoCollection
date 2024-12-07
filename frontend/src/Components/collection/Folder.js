import React from "react";
import "./Folder.css";

const Folder = ({ folder }) => {
    return (
        <div className="folder">
            {/* <div className="folder-preview">
                {folder.images.slice(0, 4).map((img, index) => (
                    <img key={index} src={img} alt="Folder Preview" className="folder-img" />
                ))}
            </div> */}
            <div className="folder-name" id={folder.id}>{folder.name}</div>
        </div>
    );
};

export default Folder;
