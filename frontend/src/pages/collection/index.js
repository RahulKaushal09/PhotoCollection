import React, { useState } from "react";

import FilterBar from "../../Components/filters/FilterBar";
import FolderGrid from "../../Components/collection/FolderGrid";
import ImageGrid from "../../Components/collection/ImageGrid";
import { useEffect } from "react";
import "./Collections.css";

const Collections = () => {
    const [filter, setFilter] = useState("All");
    const [data, setData] = useState({ folders: [], files: [] });
    const [error, setError] = useState(null);
    const [folders, setFolders] = useState([]);
    const [images, setImages] = useState([]);


    useEffect(() => {
        const fetchCollections = async () => {
            await getAllCollection(setData);
        };

        fetchCollections();
    }, []);

    async function getAllCollection(setData) {
        const accessToken = localStorage.getItem('accessToken');
        const folderId = localStorage.getItem('folderId');
        const backendUrl = 'http://localhost:5000';

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
    return (
        <div className="collectionBox">
            <FilterBar filter={filter} setFilter={setFilter} />
            <div className="content">
                <div className={`folder-section ${filter === "All" || filter === "Folders" ? "" : "hidden"}`}>
                    <h2>Folder Collection</h2>
                    <FolderGrid folders={folders} />
                </div>

                <div className={`image-section ${filter === "All" || filter === "Pictures" ? "" : "hidden"}`}>
                    <h2>Image Collection</h2>
                    <ImageGrid images={images} />
                </div>
            </div>

        </div>
    );
};

export default Collections;
