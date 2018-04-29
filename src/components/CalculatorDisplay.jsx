import React, { Component } from 'react'

class CalulatorDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: props.input
        }
    }

    render() {
        return (<div>
            <input 
                type="text" 
                id="display" 
                value={this.state.input} 
                readOnly />
        </div>);
    }

}

export default CalulatorDisplay