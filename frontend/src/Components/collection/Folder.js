import React from 'react';
import './Folder.css';
import folderIcon from '../../assets/images/folder.png';
const Folder = ({ folder }) => {
    console.log(folder); // Check the folder data in the console

    // Use optional chaining to safely access the images array
    const images = folder?.files || []; // Default to an empty array if folder.images is undefined

    return (
        <div className="folder-container">
            <div className="folder">
                <div className="folder-icon">
                    <img src={folderIcon} alt="Folder Icon" className="folder-icon-img" />
                    <div className="folder-preview">
                        {images.slice(0, 4).map((img, index) => (
                            <img key={index} src={img} alt="Folder Preview" className="folder-img" />
                        ))}
                    </div>
                </div>
                <div className="folder-name" id={folder.id}>{folder.name}</div>
            </div>
        </div>
    );
};

export default Folder;
