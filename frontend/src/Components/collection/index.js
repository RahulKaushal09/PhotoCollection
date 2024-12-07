import React, { useState, useEffect } from 'react';
import ImageViewer from '../imageViewer/index';
const CollectionsViewer = () => {
    const [data, setData] = useState({ folders: [], files: [] });
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCollections = async () => {
            await getAllCollection(setData);
        };

        fetchCollections();
    }, []);



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



export default CollectionsViewer;
