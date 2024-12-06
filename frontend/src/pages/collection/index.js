import React, { useState, useEffect } from 'react';
import ImageViewer from '../../Components/imageViewer/index';
const CollectionsViewer = () => {
    const [data, setData] = useState({ folders: [], files: [] });
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCollections = async () => {
            await getAllCollection(setData);
        };

        fetchCollections();
    }, []);

    // Function to generate image URL for Google Drive
    const getImageUrl = (fileId) => {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    };

    return (
        <div>
            <h2>Folders</h2>
            {data.folders.length === 0 ? (
                <p>No folders found.</p>
            ) : (
                <ul>
                    {data.folders.map((folder) => (
                        <li key={folder.id}>
                            <strong>{folder.name}</strong> (ID: {folder.id})
                        </li>
                    ))}
                </ul>
            )}

            <h2>Files</h2>
            {data.files.length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul>
                    {data.files.map((file) => (
                        <li key={file.id}>
                            {file.mimeType.startsWith('image/') ? (
                                <div>
                                    <ImageViewer fileId={file.id} />
                                </div>
                            ) : (
                                <p>File is not an image.</p>
                            )}
                            <strong>{file.name}</strong> (MIME Type: {file.mimeType})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

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

export default CollectionsViewer;
