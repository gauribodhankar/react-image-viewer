import React from 'react'

const OperatorKeySet = (props) => {

    const add = () => {
        console.log('add');
        // TODO
    }
    const subtract = () => {
        console.log('subtract');
        // TODO
    }
    const multiply = () => {
        console.log('Currently not available');
    }
    const divide = () => {
        console.log('Currently not available');
    }

    return (
        <div className="key-set operator-key-set">
            <button className="btn-basic-oper" onClick={() => divide()}>&divide;</button>
            <button className="btn-basic-oper" onClick={() => multiply()}>&times;</button>
            <button className="btn-basic-oper" onClick={() => subtract()}>-</button>
            <button className="btn-basic-oper" onClick={() => add()}>+</button>
        </div>
    )
  };

export default OperatorKeySet