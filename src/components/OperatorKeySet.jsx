import React from 'react'

const OperatorKeySet = ({ onAdd, onSubtract }) => {

    return (
        <div className="key-set operator-key-set">
            <button className="btn-basic-oper" disabled>&divide;</button>
            <button className="btn-basic-oper" disabled>&times;</button>
            <button className="btn-basic-oper" onClick={() => onSubtract()}>-</button>
            <button className="btn-basic-oper" onClick={() => onAdd()}>+</button>
        </div>
    )
};

export default OperatorKeySet