import React from "react";
import "./ImageGrid.css";

const ImageGrid = ({ images }) => {
    return (
        <div className="image-grid">
            {images.map((img, index) => (
                <img key={index} src={img} alt="Image" className="grid-image" />
            ))}
        </div>
    );
};

export default ImageGrid;
