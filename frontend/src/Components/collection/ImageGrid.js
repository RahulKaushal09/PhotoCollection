import React from "react";
import "./ImageGrid.css";  // Assuming you're using this for styling
import ImageViewer from "../imageViewer/index.js";

const ImageGrid = ({ images }) => {
    return (
        <div className="image-grid">
            {images.map((imgobj, index) => (
                <div key={index} className="image-item">
                    <ImageViewer fileId={imgobj.imgId} />
                    <div className="image-name">{imgobj.imgName}</div>
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
