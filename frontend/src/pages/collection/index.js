import React, { useState } from "react";

import FilterBar from "../../Components/filters/FilterBar";
import FolderGrid from "../../Components/collection/FolderGrid";
import ImageGrid from "../../Components/collection/ImageGrid";
import { useEffect } from "react";
import "./Collections.css";

const Collections = (folders, images) => {
    const [filter, setFilter] = useState("All");
    const [data, setData] = useState({ folders: [], files: [] });
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCollections = async () => {
            await getAllCollection(setData);
        };

        fetchCollections();
    }, []);
    // Mock Data
    // const folders = [
    //     { id: 1, name: "Vacation", images: ["img1.jpg", "img2.jpg"] },
    //     { id: 2, name: "Work", images: ["img3.jpg", "img4.jpg"] },
    // ];

    // const images = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];
    // Fetch collections and update state
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
        } catch (error) {
            console.error('Error fetching collections:', error.message);
        }
    }
    return (
        <div className="collectionBox">
            <FilterBar filter={filter} setFilter={setFilter} />
            <div className="content">
                {/* {filter === "All" || filter === "Folders" ? (
                    <FolderGrid folders={folders} />
                ) : null}
                {filter === "All" || filter === "Pictures" ? (
                    <ImageGrid images={images} />
                ) : null} */}
            </div>
        </div>
    );
};

export default Collections;
