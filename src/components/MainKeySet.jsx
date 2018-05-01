import React from 'react'

const MainKeySet = ({ onNumberClick, onEnter }) => {

    const keys = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0];
    return (
        <div className="key-set">
            {keys.map((key, index) => {
                return <button
                    key={key}
                    className="btn-number"
                    onClick={() => onNumberClick(key)}>
                    {key}
                </button>
            })}
            <button className="btn-enter" onClick={() => onEnter()}>&crarr;</button>
        </div>
    )
};

export default MainKeySet