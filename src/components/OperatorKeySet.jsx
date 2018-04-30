import React from 'react'

const OperatorKeySet = (props) => {

    const add = () => {
        console.log('add');
    }
    const subtract = () => {
        console.log('subtract');
    }
    const multiply = () => {
        console.log('multiply');
    }
    const divide = () => {
        console.log('divide');
    }

    return (
        <div className="basic-operations">
            <button onClick={() => divide()}>&divide;</button>
            <button onClick={() => multiply()}>&times;</button>
            <button onClick={() => subtract()}>-</button>
            <button onClick={() => add()}>+</button>
            <button onClick={() => squareRoot()}>&radic;</button>
        </div>
    )
  };

export default OperatorKeySet