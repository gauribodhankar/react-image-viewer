import React, { Component } from 'react'

class Image extends Component {

    constructor(props) { // TODO: do we need the constructor
        super(props);       
    } 

    render() {
        return (
            <div className="image">
                <img 
                    className="movie-img"
                    id={this.props.assetId}
                    index={this.props.index} 
                    src={this.props.url} 
                    draggable="true"
                    onDragStart={() => {
                        this.props.handleDragStart(this.props.index);
                    }}
                    onDragOver={this.props.handleDragOver}
                    onDrop={() => {
                        this.props.handleDrop(this.props.index);
                    }} 
                    onError={this.props.handleImageError} />
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
*/