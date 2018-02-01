import React, { Component } from 'react'

class Image extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="image">
                <img id={this.props.assetId} src={this.props.url} />
            </div>
        )
    }
}
export default Image;