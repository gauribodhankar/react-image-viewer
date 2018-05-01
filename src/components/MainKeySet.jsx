import React from 'react'

const MainKeySet = ({onNumberClick, onEnter}) => {

    const numberClicked = (number) => {
        onNumberClick(number);
    }
    const decimalClicked = () => {
        console.log('Currently not available');
    }
    const enterClicked = () => {
        onEnter();
    }

    return (
        <div className="key-set">
            <button className="btn-number" onClick={() => numberClicked(7)}>7</button>
            <button className="btn-number" onClick={() => numberClicked(8)}>8</button>
            <button className="btn-number" onClick={() => numberClicked(9)}>9</button>
            <button className="btn-number" onClick={() => numberClicked(4)}>4</button>
            <button className="btn-number" onClick={() => numberClicked(5)}>5</button>
            <button className="btn-number" onClick={() => numberClicked(6)}>6</button>
            <button className="btn-number" onClick={() => numberClicked(1)}>1</button>
            <button className="btn-number" onClick={() => numberClicked(2)}>2</button>
            <button className="btn-number" onClick={() => numberClicked(3)}>3</button>
            <button className="btn-number" onClick={() => decimalClicked()}>.</button>
            <button className="btn-number" onClick={() => numberClicked(0)}>0</button>
            <button className="btn-enter" onClick={() => enterClicked()}>&crarr;</button>
        </div>
    )
  };

export default MainKeySet