import React from 'react'

const Image = ({ index, assetId, url, movieId, height, width, deploymentTs, handleDragStart, handleDragOver, handleDrop, handleImageError }) => (
    <li
        className="image"
        draggable="true"
        onDragStart={() => {
            handleDragStart(index);
        }}
        onDragOver={handleDragOver}
        onDrop={() => {
            handleDrop(index);
        }}>
        <img
            className="movie-image"
            id={assetId}
            index={index}
            src={url}
            alt={assetId}
            onError={handleImageError} />

        <div className="overlay"></div>
        <div className="image-details">
            <span className="image-details-item">ID: {movieId}</span>
            <span className="image-details-item">{height} X {width}</span>
            <span className="image-details-item">{deploymentTs}</span>
        </div>
    </li>
)

export default Image;