import React, { Component } from 'react'

class Error extends Component {

    constructor(props) { // TODO: do we need the constructor
        super(props);       
    } 

    render() {
        return (
            <div className="error-msg">{this.props.errorMessage}</div>
        )
    }
}
export default Error;