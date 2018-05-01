import React from 'react'

const CalulatorDisplay = ({ input, stack }) => {

    return (
        <div className="calculator-display">
            <label className="input-output-display">
                {stack}
            </label>
            <label className="input-output-display">
                {input}
            </label>
        </div>
    );
}

export default CalulatorDisplay