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

/*
image onerror - what happens if the page fails to load
DONE drag-drop functionality needs to be in the parent
DONEtry to have stateless components
popover component
popover control should also be with the parent
image rendering - 
- counter/limit
load more link
- at a time there can be only x no of images/dom nodes on the page
as user moves down, remove the top nodes that are no longer visible to the user

TODO: loading/spinner
TODO: default image if image does not load
TODO: provide alt text
TODO: convert timestamp to a proper date
TODO: Animate/make the image bigger on hover
TODO: create a helper for the fetch call that exports a function with params start index, end index and fetch each time
TODO: show backgroud color before image loads
TODO: use li or div for images?
*/