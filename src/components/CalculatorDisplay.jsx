import React from 'react'

const CalulatorDisplay = (props) => {

    return (
        <div>
            <label className="input-output-display">
                {props.input}
            </label>
        </div>
    );
}

export default CalulatorDisplay