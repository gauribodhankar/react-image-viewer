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
            <label className="input-output-display">
                {this.state.input}
            </label>
        </div>);
    }

}

export default CalulatorDisplay