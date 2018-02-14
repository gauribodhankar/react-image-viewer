import React, { Component } from 'react'

class Image extends Component {

    constructor(props) {
        super(props);

        this.defaultImageUrl = './src/images/img_not_available.png';
        this.state = {
            url: props.url || this.defaultImageUrl
        }
    }

    render() {
        return (<li
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
                src={this.state.url}
                alt={this.props.assetId}
                onError={() => {
                    this.setState({ url: this.defaultImageUrl })}
                 } />

            {/* on hover */}
            <div className="overlay"></div>
            <div className="image-details">
                <span className="image-details-item">ID: {this.props.movieId}</span>
                <span className="image-details-item">{this.props.height} X {this.props.width}</span>
                <span className="image-details-item">{this.props.deploymentTs}</span>
            </div>
        </li>)
    }
}

export default Image;