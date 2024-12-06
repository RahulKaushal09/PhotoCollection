import React, { useState, useEffect } from 'react';

const ImageViewer = ({ fileId }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (accessToken) {
            // Fetch the image using the Google Drive API and access token
            fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
                .then(response => response.blob())
                .then(blob => {
                    // Create a local URL for the image blob and update the state
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                })
                .catch(error => {
                    console.error('Error fetching the image:', error);
                });
        } else {
            console.error('Access token is missing');
        }
    }, [fileId, accessToken]);

    return (
        <div>
            {imageUrl ? (
                <img src={imageUrl} alt="Google Drive File" style={{ width: '300px', height: 'auto' }} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ImageViewer;