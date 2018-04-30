import React from 'react'

const CalulatorDisplay = (props) => {

    return (
        <label className="input-output-display">
            {props.input}
        </label>
    );
}

export default CalulatorDisplay