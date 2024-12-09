import React, { useState } from "react";
import FilterBar from "../../Components/filters/FilterBar";
import FolderGrid from "../../Components/collection/FolderGrid";
import ImageGrid from "../../Components/collection/ImageGrid";
import { useEffect } from "react";
import "./Collections.css";
import { useParams } from "react-router-dom";
import { backendUrl } from "../../config";
const Collections = () => {
    const [filter, setFilter] = useState("All");
    const [data, setData] = useState({ folders: [], files: [] });
    const [folders, setFolders] = useState([]);
    const [images, setImages] = useState([]);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [imageName, setImageName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const { parentFolderId, parentFolderName } = useParams();

    useEffect(() => {
        const fetchCollections = async () => {
            await getAllCollection(setData);
        };

        fetchCollections();
    }, [parentFolderId]);

    async function getAllCollection(setData) {
        const accessToken = localStorage.getItem('accessToken');
        var folderId = localStorage.getItem('folderId');
        console.log('parentFolderId:', parentFolderId);
        console.log('parentFolderName:', parentFolderName);
        setImages([]);
        setFolders([]);

        if (parentFolderId) {
            console.log(parentFolderId);
            folderId = parentFolderId;
        }

        // const backendUrl = 'http://localhost:5000';

        if (!accessToken || !folderId) {
            console.error('Missing required data: access token or folder ID');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/getAllCollection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken, folderId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response Data:', data);

            // Update state with fetched data
            setData(data);
            setFolders(data.folders || []);
            setImages(
                data.files.map(file => ({
                    imgId: file.id,
                    imgName: file.name
                }))
            );

        } catch (error) {
            console.error('Error fetching collections:', error.message);
        }
    }

    const handleCreateFolder = () => {
        setIsCreateFolderModalOpen(true);
    };

    const handleAddImage = () => {
        setIsAddImageModalOpen(true);
    };

    const handleCreateFolderModalClose = () => {
        setIsCreateFolderModalOpen(false);
        setNewFolderName("");
    };

    const handleAddImageModalClose = () => {
        setIsAddImageModalOpen(false);
        setImageName("");
        setSelectedFile(null);
    };

    const handleCreateFolderSubmit = async () => {
        if (newFolderName.trim() === "") {
            alert("Folder name cannot be empty");
            return;
        }

        console.log("Creating folder:", newFolderName);

        try {
            const response = await fetch(`${backendUrl}/create-folder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newFolderName,
                    ParentFolderId: parentFolderId,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Folder created successfully");
                // Refresh folder data or state
            } else {
                alert(`Error creating folder: ${result.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error creating folder:", error);
            alert("Error creating folder. Please try again.");
        }

        handleCreateFolderModalClose();
        getAllCollection(setData);
    };

    const handleAddImageSubmit = async () => {
        if (imageName.trim() === "" || !selectedFile) {
            alert("Image name and file are required");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", imageName);

        try {
            const response = await fetch(`${backendUrl}/upload/${selectedFolderId || parentFolderId}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Image uploaded successfully:", result);
        } catch (error) {
            console.error("Error uploading image:", error.message);
            alert("Image upload failed. Please try again.");
        }

        handleAddImageModalClose();
    };


    return (
        <div className="collectionBox">
            <h1>{parentFolderId !== undefined && parentFolderId !== null ? parentFolderName : "Your Trip Lens"}</h1>

            <FilterBar filter={filter} setFilter={setFilter} handleCreateFolder={handleCreateFolder} handleAddImage={handleAddImage} />
            <div className="content">
                <div className={`folder-section ${filter === "All" || filter === "Folders" ? "" : "hidden"}  ${images.length > 0 ? "" : "hidden"}`} >
                    <h2>Folder Collection</h2>
                    <FolderGrid folders={folders} />
                </div>

                <div className={`image-section ${filter === "All" || filter === "Pictures" ? "" : "hidden"} ${images.length > 0 ? "" : "hidden"}`} >
                    <h2>Image Collection</h2>
                    <ImageGrid images={images} />
                </div>
            </div>
            {isCreateFolderModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create New Folder</h2>
                        <input
                            type="text"
                            placeholder="Enter folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="btn cancel" onClick={handleCreateFolderModalClose}>Cancel</button>
                            <button className="btn submit" onClick={handleCreateFolderSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            )}
            {isAddImageModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add Image</h2>
                        <input
                            type="text"
                            placeholder="Enter image name"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                        />
                        <select
                            value={selectedFolderId}
                            onChange={(e) => setSelectedFolderId(e.target.value)}
                        >
                            <option value="">Current Folder</option>
                            {folders.map(folder => (
                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                            ))}
                        </select>
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <div className="modal-actions">
                            <button className="btn cancel" onClick={handleAddImageModalClose}>Cancel</button>
                            <button className="btn submit" onClick={handleAddImageSubmit}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Collections;
