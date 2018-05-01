import React from 'react'

const AdvancedKeySet = ({onClear, onClearLast}) => {

    return (
        <div className="key-set">
            <button className="btn-cancel btn-long" onClick={() => onClear()}>C</button>
            <button className="btn-cancel" onClick={() => onClearLast()}>CE</button>
            <button className="btn-adv-oper" disabled>sin</button>
            <button className="btn-adv-oper" disabled>cos</button>
            <button className="btn-adv-oper" disabled>tan</button>
            <button className="btn-adv-oper" disabled>&radic;</button>
            <button className="btn-adv-oper" disabled>&pi;</button>
            <button className="btn-adv-oper" disabled>%</button>
            <button className="btn-adv-oper" disabled>M</button>
            <button className="btn-adv-oper" disabled>&rarr;ME</button>
            <button className="btn-adv-oper" disabled>+/-</button>
        </div>
    )
}
export default AdvancedKeySet