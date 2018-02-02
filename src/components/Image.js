import React, { Component } from 'react'

class Image extends Component {

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    handleDragStart(event) {
        this.props.onDragInit(this.props.index);
    }

    handleDragOver(event) {
        // event handler reports whether or not the drop target is potentially willing to accept the drop, by canceling the event
        event.preventDefault();
    }

    handleDrop(event) {
        this.props.onDragDropComplete(this.props.index);
    }

    render() {
        return (
            <div className="image">
                <img 
                    id={this.props.assetId}
                    index={this.props.index} 
                    src={this.props.url} 
                    draggable="true"
                    onDragStart={this.handleDragStart}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop} />
            </div>
        )
    }
}
export default Image;