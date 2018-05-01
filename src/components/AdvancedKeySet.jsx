import React from 'react'

const AdvancedKeySet = (props) => {

    const advancedOperationSelected = () => {
        console.log('Currently not available');
    }

    return (
        <div className="key-set">
            <button className="btn-cancel btn-long" onClick={() => props.onClear()}>C</button>
            <button className="btn-cancel" onClick={() => props.onClearLast()}>CE</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelected()}>sin</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelected()}>cos</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelected()}>tan</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelectedadd()}>&radic;</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelectedadd()}>&pi;</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelectedadd()}>%</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelectedadd()}>M</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelected()}>&rarr;ME</button>
            <button className="btn-adv-oper" onClick={() => advancedOperationSelected()}>+/-</button>
        </div>
    )
}
export default AdvancedKeySet