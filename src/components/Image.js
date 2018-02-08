import React, { Component } from 'react'

class Image extends Component {

    constructor(props) { // TODO: do we need the constructor
        super(props);       
    } 

    render() {
        return (
            <div 
                className="image"
                draggable="true"
                onDragStart={() => {
                    this.props.handleDragStart(this.props.index);
                }}
                onDragOver={this.props.handleDragOver}
                onDrop={() => {
                    this.props.handleDrop(this.props.index);
                }}>
                <img 
                    className="movie-image"
                    id={this.props.assetId}
                    index={this.props.index} 
                    src={this.props.url} 
                    onError={this.props.handleImageError} />

                <div className="overlay"></div>
                <div className="image-details">
                    <span className="image-details-item">ID: {this.props.movieId}</span>
                    <span className="image-details-item">{this.props.height} X {this.props.width}</span>
                    <span className="image-details-item">{this.props.deploymentTs}</span>
                </div>
            </div>
        )
    }
}
export default Image;