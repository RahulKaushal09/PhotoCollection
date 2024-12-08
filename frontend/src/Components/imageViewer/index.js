import React, { useState, useEffect } from "react";
import "./ImageViewer.css";

const ImageViewer = ({ fileId }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        if (accessToken) {
            fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);

                    // const url = URL.createObjectURL(data);
                    // setImageUrl(url);
                    setImageUrl(data.thumbnailLink);
                })
                .catch((error) => {
                    console.error("Error fetching the image:", error);
                });
        } else {
            console.error("Access token is missing");
        }
    }, [fileId, accessToken]);

    return (
        <div className="image-card">
            {imageUrl ? (
                <img src={imageUrl} alt="Google Drive File" className="image" />
            ) : (
                <div className="loading-placeholder">Loading...</div>
            )}
        </div>
    );
};

export default ImageViewer;
