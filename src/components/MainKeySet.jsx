import React from 'react'

const MainKeySet = (props) => {

    const numberClicked = (number) => {
        console.log(number);
    }
    const decimalClicked = () => {
        console.log('.');
    }
    const enterClicked = () => {
        console.log('enter');
    }

    return (
        <div className="basic-operations">
            <button onClick={() => numberClicked(7)}>7</button>
            <button onClick={() => numberClicked(8)}>8</button>
            <button onClick={() => numberClicked(9)}>9</button>
            <button onClick={() => numberClicked(4)}>4</button>
            <button onClick={() => numberClicked(5)}>5</button>
            <button onClick={() => numberClicked(6)}>6</button>
            <button onClick={() => numberClicked(1)}>1</button>
            <button onClick={() => numberClicked(2)}>2</button>
            <button onClick={() => numberClicked(3)}>3</button>
            <button onClick={() => decimalClicked()}>.</button>
            <button onClick={() => numberClicked(0)}>0</button>
            <button onClick={() => enterClicked()}>=</button>
        </div>
    )
  };

export default MainKeySet